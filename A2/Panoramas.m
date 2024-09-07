% Retrieved from https://www.mathworks.com/help/vision/ug/feature-based-panoramic-image-stitching.html?searchHighlight=panoramic&s_tid=srchtitle_panoramic_1
function panorama = Panoramas(num, useHarris)
    %load image

    %Picdir = 'Pic5';
    %useHarris =  0;
    Picdir = string("Pic" + string(num));
    imageDir = fullfile(Picdir,'*.jpg');
    ImageDataStore = imageDatastore(imageDir);
    % Display images to be stitched.
    montage(ImageDataStore.Files)
    % Read the first image from the image set.
    I = readimage(ImageDataStore,1);

    % Initialize features for I(1)

    grayImage = im2gray(I);
    [points,~] = my_fast_detector(grayImage,0.01,useHarris);
    [features, points] = extractFeatures(grayImage,points);

    % Initialize all the transformations to the identity matrix. Note that the
    % projective transformation is used here because the building images are fairly
    % close to the camera. For scenes captured from a further distance, you can use
    % affine transformations.
    numImages = numel(ImageDataStore.Files);
    tforms(numImages) = projtform2d;

    % Initialize variable to hold image sizes.
    imageSize = zeros(numImages,2);

    % Iterate over remaining image pairs
    for n = 2:numImages
        % Store points and features for I(n-1).
        pointsPrevious = points;
        featuresPrevious = features;

        % Read I(n).
        I = readimage(ImageDataStore, n);

        % Convert image to grayscale.
        grayImage = im2gray(I);

        % Save image size.
        imageSize(n,:) = size(grayImage);

        % Detect and extract SURF features for I(n).
        [points,~] = my_fast_detector(grayImage,0.01,useHarris);
        [features, points] = extractFeatures(grayImage, points);

        % Find correspondences between I(n) and I(n-1).
        indexPairs = matchFeatures(features, featuresPrevious, 'Unique', true);

        matchedPoints = points(indexPairs(:,1), :);
        matchedPointsPrev = pointsPrevious(indexPairs(:,2), :);

        %For Step 4
        
        if useHarris
            saveas(showMatchedFeatures(readimage(ImageDataStore, n-1), grayImage, matchedPoints, matchedPointsPrev), "S" + string(num) + "-fastRMatch.png", "png");
        else
            saveas(showMatchedFeatures(readimage(ImageDataStore, n-1), grayImage, matchedPoints, matchedPointsPrev), "S" + string(num) + "-fastMatch.png", "png");
        end




        % Estimate the transformation between I(n) and I(n-1).
        tforms(n) = estgeotform2d(matchedPoints, matchedPointsPrev,...
            'rigid', 'Confidence', 99.9, 'MaxNumTrials', 4000, MaxDistance = 50);

        % Compute T(1) * T(2) * ... * T(n-1) * T(n).
        tforms(n).A = tforms(n-1).A * tforms(n).A;
    end
    % Compute the output limits for each transformation.
    for j = 1:numel(tforms)
        [xlim(j,:), ylim(j,:)] = outputLimits(tforms(j), [1 imageSize(j,2)], [1 imageSize(j,1)]);
    end
    avgXLim = mean(xlim, 2);
    [~,idx] = sort(avgXLim);
    centerIdx = floor((numel(tforms)+1)/2);
    centerImageIdx = idx(centerIdx);

    Tinv = invert(tforms(centerImageIdx));
    for j = 1:numel(tforms)
        tforms(j).A = Tinv.A * tforms(j).A;
    end
    for j = 1:numel(tforms)
        [xlim(j,:), ylim(j,:)] = outputLimits(tforms(j), [1 imageSize(j,2)], [1 imageSize(j,1)]);
    end

    maxImageSize = max(imageSize);

    % Find the minimum and maximum output limits.
    xMin = min([1; xlim(:)]);
    xMax = max([maxImageSize(2); xlim(:)]);

    yMin = min([1; ylim(:)]);
    yMax = max([maxImageSize(1); ylim(:)]);

    % Width and height of panorama.
    width  = round(xMax - xMin);
    height = round(yMax - yMin);

    % Initialize the "empty" panorama.
    panorama = zeros([height width 3], 'like', I);
    blender = vision.AlphaBlender('Operation', 'Binary mask', ...
        'MaskSource', 'Input port');

    % Create a 2-D spatial reference object defining the size of the panorama.
    xLimits = [xMin xMax];
    yLimits = [yMin yMax];
    panoramaView = imref2d([height width], xLimits, yLimits);

    % Create the panorama.
    for j = 1:numImages

        I = readimage(ImageDataStore, j);

        % Transform I into the panorama.
        warpedImage = imwarp(I, tforms(j), 'OutputView', panoramaView);

        % Generate a binary mask.
        mask = imwarp(true(size(I,1),size(I,2)), tforms(j), 'OutputView', panoramaView);

        % Overlay the warpedImage onto the panorama.
        panorama = step(blender, panorama, warpedImage, mask);
    end

    figure
    imshow(panorama)

    if useHarris
        file_name = string("S" + string(num) + "-panorama.png");
        imwrite(panorama,file_name,'png');
    end
end