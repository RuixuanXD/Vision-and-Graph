function Points = Harris(pic)
        sobelKernel = [-1 0 1; -2 0 2; -1 0 1];
    gaussianKernel = fspecial("gaussian", 5, 1);
    dogKernel = conv2(gaussianKernel, sobelKernel);

    ix = imfilter(pic, dogKernel);
    iy = imfilter(pic, dogKernel');
    ix2 = imfilter(ix .* ix, gaussianKernel);
    iy2 = imfilter(iy .* iy, gaussianKernel);
    ixiy = imfilter(ix .* iy, gaussianKernel);

    harrisCorners = ix2 .* iy2 - ixiy .* ixiy - 0.05 * (ix2 + iy2) .^ 2;

    localMax = imdilate(harrisCorners, ones(3));
    Points = (harrisCorners == localMax) .* (harrisCorners > 0.00001);
end