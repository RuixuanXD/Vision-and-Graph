P11 = imread('Pic1/1.jpg');
P12 = imread('Pic1/2.jpg');
P13 = imread('Pic1/3.jpg');
P14 = imread('Pic1/4.jpg');
P21 = imread('Pic2/1.jpg');
P22 = imread('Pic2/2.jpg');
P31 = imread('Pic3/1.jpg');
P32 = imread('Pic3/2.jpg');
P33 = imread('Pic3/3.jpg');
P34 = imread('Pic3/4.jpg');
P41 = imread('Pic4/1.jpg');
P42 = imread('Pic4/2.jpg');
allImArr = {P11, P12, P13, P14, P21, P22, P31, P32, P33, P34, P41, P42};

 for i=1:length(allImArr)
        [x, y, ~] = size(allImArr{i});
        if x > y
            scale = 750/x;
        else
            scale = 750/y;
        end
        allImArr{i} = imresize(allImArr{i}, scale);
 end

imwrite(allImArr{1}, 'S1-im1.png','png');
imwrite(allImArr{2}, 'S1-im2.png','png');
imwrite(allImArr{3}, 'S1-im3.png','png');
imwrite(allImArr{4}, 'S1-im4.png','png');
imwrite(allImArr{5}, 'S2-im1.png','png');
imwrite(allImArr{6}, 'S2-im2.png','png');
imwrite(allImArr{7}, 'S3-im1.png','png');
imwrite(allImArr{8}, 'S3-im2.png','png');
imwrite(allImArr{9}, 'S3-im3.png','png');
imwrite(allImArr{10}, 'S3-im4.png','png');
imwrite(allImArr{11}, 'S4-im1.png','png');
imwrite(allImArr{12}, 'S4-im2.png','png');
 
%S1_im1 = Panoramas('Pic1');
%S1_im2 = Panoramas('Pic2');
%S1_im3 = Panoramas('Pic3');
%S1_im4 = Panoramas('Pic4');

FASTarr = {12};
FASTRarr = {12};
VISarr = {12};
VISRarr = {12};

[FASTarr{1}, VISarr{1}] = my_fast_detector(P11,0.05,0);
[FASTarr{2}, VISarr{2}] = my_fast_detector(P12,0.05,0);
[FASTarr{3}, VISarr{3}] = my_fast_detector(P13,0.05,0);
[FASTarr{4}, VISarr{4}] = my_fast_detector(P14,0.05,0);
[FASTarr{5}, VISarr{5}] = my_fast_detector(P21,0.05,0);
[FASTarr{6}, VISarr{6}] = my_fast_detector(P22,0.05,0);
[FASTarr{7}, VISarr{7}] = my_fast_detector(P31,0.05,0);
[FASTarr{8}, VISarr{8}] = my_fast_detector(P32,0.05,0);
[FASTarr{9}, VISarr{9}] = my_fast_detector(P33,0.05,0);
[FASTarr{10}, VISarr{10}] = my_fast_detector(P34,0.05,0);
[FASTarr{11}, VISarr{11}] = my_fast_detector(P41,0.05,0);
[FASTarr{12}, VISarr{12}] = my_fast_detector(P42,0.05,0);

[FASTRarr{1}, VISRarr{1}] = my_fast_detector(P11,0.05,1);
[FASTRarr{2}, VISRarr{2}] = my_fast_detector(P12,0.05,1);
[FASTRarr{3}, VISRarr{3}] = my_fast_detector(P13,0.05,1);
[FASTRarr{4}, VISRarr{4}] = my_fast_detector(P14,0.05,1);
[FASTRarr{5}, VISRarr{5}] = my_fast_detector(P21,0.05,1);
[FASTRarr{6}, VISRarr{6}] = my_fast_detector(P22,0.05,1);
[FASTRarr{7}, VISRarr{7}] = my_fast_detector(P31,0.05,1);
[FASTRarr{8}, VISRarr{8}] = my_fast_detector(P32,0.05,1);
[FASTRarr{9}, VISRarr{9}] = my_fast_detector(P33,0.05,1);
[FASTRarr{10}, VISRarr{10}] = my_fast_detector(P34,0.05,1);
[FASTRarr{11}, VISRarr{11}] = my_fast_detector(P41,0.05,1);
[FASTRarr{12}, VISRarr{12}] = my_fast_detector(P42,0.05,1);

imwrite(VISarr{1},'S1-fast.png','png');
imwrite(VISarr{5},'S2-fast.png','png');
imwrite(VISRarr{1},'S1-fastR.png','png');
imwrite(VISRarr{5},'S2-fastR.png','png');



%For step 4, 5, and 6
%The function are defined in Panoramas.m, and the structure are retrieved
%from Matlab library (Link is in file)

%%
%For using Harris
Panoramas(1,1);
%%
Panoramas(2,1);
%%
Panoramas(3,1);
%%
Panoramas(4,1);
%%
%For not useing Harris, Do not save

Panoramas(1,0);
%%
Panoramas(2,0);
%%
Panoramas(3,0);
%%
Panoramas(4,0);
%%
