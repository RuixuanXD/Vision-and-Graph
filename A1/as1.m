hp = imread('1.jpg');
hp = rgb2gray(hp);
hp = im2double(hp);
hp = imresize(hp,[500 500]);
lp = imread('3.jpg');
lp = rgb2gray(lp);
lp = im2double(lp);
lp = imresize(lp,[500 500]);
hp_freq = abs(fftshift(fft2(hp)))/50;
lp_freq = abs(fftshift(fft2(lp)))/250;
gauskern = fspecial('gaussian',20,2.5);
surf(gauskern);
gauskern2 = fspecial('gaussian',20,2.5);
sob = [-1 0 1; -2 0 2; -1 0 1];
dog = conv2(gauskern2,sob);
surf(dog);
gauskern_hp = imfilter(hp,gauskern);
gaushp_freq = abs(fftshift(fft2(gauskern_hp)))/30;
gauskern_lp = imfilter(lp,gauskern);
gauslp_freq = abs(fftshift(fft2(gauskern_lp)))/30;
doghp = abs(imfilter(hp,conv2(gauskern2,sob)));
doghp_freq = abs(fftshift(fft2(doghp)))/12;
doglp = abs(imfilter(lp,conv2(gauskern2,sob)));
doglp_freq = abs(fftshift(fft2(doglp)))/40;
hp_2 = hp(1:2:end,1:2:end);
hp_2freq = abs(fftshift(fft2(hp_2)))/80;
lp_2 = lp(1:2:end,1:2:end);
lp_2freq = abs(fftshift(fft2(lp_2)))/80;
hp_4 = hp(1:4:end,1:4:end);
hp_4freq = abs(fftshift(fft2(hp_4)))/60;
lp_4 = lp(1:4:end,1:4:end);
lp_4freq = abs(fftshift(fft2(lp_4)))/60;
gauskern_sub1 = fspecial('gaussian',20,2);
hp_2aa = abs(imfilter(hp,gauskern_sub1));
hp_2aa = hp_2aa(1:2:end, 1:2:end);
hp_2aafreq = abs(fftshift(fft2(hp_2aa)))/60;
gauskern_sub2 = fspecial('gaussian',20,5);
hp_4aa = abs(imfilter(hp,gauskern_sub2));
hp_4aa = hp_4aa(1:4:end, 1:4:end);
hp_4aafreq = abs(fftshift(fft2(hp_4aa)))/50;
[cannyedge, thresh] = edge(hp,'canny');
thresh;
HP_canny_optimal = edge(hp,'canny',[0.0375,0.0938]);
HP_canny_lowlow = edge(hp,'canny',[0.001,0.01]);
HP_canny_highlow = edge(hp,'canny',[0.012,0.21]);
HP_canny_lowhigh = edge(hp,'canny',[0.02,0.03]);
HP_canny_highhigh = edge(hp,'canny',[0.2,0.315]);
[cannyedge2, thresh] = edge(lp,'canny');
thresh;
LP_canny_optimal = edge(lp,'canny',[0.0313,0.0781]);
LP_canny_lowlow = edge(lp,'canny',[0.0008,0.01]);
LP_canny_highlow = edge(lp,'canny',[0.09,0.15]);
LP_canny_lowhigh = edge(lp,'canny',[0.02,0.026]);
LP_canny_highhigh = edge(lp,'canny',[0.15,0.3]);
