function [points,Visual] = my_fast_detector(pic,threshold,useHarris) 
    
    %pic = imread('test.jpg');
    %threshold = 0.1;
    %useHarris = 0;

    figure('visible','on')
    [M N D]=size(pic); 
    if D==3
        pic=rgb2gray(pic);
    end
    
    pic = im2double(pic);
    
    points = zeros(size(pic));
    

    mask=[0 0 1 1 1 0 0;...  
          0 1 0 0 0 1 0;...  
          1 0 0 0 0 0 1;...  
          1 0 0 0 0 0 1;...  
          1 0 0 0 0 0 1;...  
          0 1 0 0 0 1 0;...  
          0 0 1 1 1 0 0];

    mask=double(mask);

    imshow(pic);
    
    tic;
               
    for i=4:M-3  
        for j=4:N-3
            points = FAST_detector(i,j,pic,points,threshold,mask);
        end  
    end
   
    
    if useHarris
        points = Harris(pic) & points;
    end

    points = NonMaxSuppression(points);
  
    hold on;
    point = [];

    for i=4:M-3  
        for j=4:N-3
            if(points(i,j) ~= 0)                
                plot(j,i,'go');
                point = [point;i j];
            end
        end  
    end

    hold off;

    F = getframe;
    Visual = F.cdata;
    points = point;

    toc;
end

function points = FAST_detector(i,j,pic,points,threshold,mask)
    
            %high speed detect
            P1=abs(pic(i-3,j)-pic(i,j))>threshold;  
            P9=abs(pic(i+3,j)-pic(i,j))>threshold;  
            P5=abs(pic(i,j+3)-pic(i,j))>threshold;  
            P13=abs(pic(i,j-3)-pic(i,j))>threshold;
             

            if sum([P1 P9 P5 P13])>=3 
                block=pic(i-3:i+3,j-3:j+3);  
                block=block.*mask;
                blockp1 = block + mask;
                pos=find(blockp1);  
                block1=(block(pos)-pic(i,j))/threshold;  
                block2=fix(block1);

                level = sum(abs(block(pos)-pic(i,j)));

                newblock = FormatBlock(block2);

                count = 1;
                            
                for k=1:15
                    if newblock(k) > 0 && newblock(k+1) > 0
                        count = count+1;
                    elseif newblock(k) < 0 && newblock(k+1) < 0
                        count = count +1;
                    else
                        count = 1;
                    end  
                end
    
                if (newblock(1) > 0 && newblock(16) > 0) || (newblock(1) < 0 && newblock(16) < 0)

                    count = count + 1;
                end

                if count>=12  
                    %plot(j,i,'go');
                    points(i,j) = level;
                end
                            
            end 

end

%Best corner in every 4*4 block
function Maxpoints = NonMaxSuppression(points)
    Maxpoints = points;
    %find(Maxpoints)
    [x,y] = size(points); 
    
    for i=4 : x-4
        for j=4 : y-4
            for k=-10:10
                for l=-10:10
                    if(Maxpoints(i,j) < Maxpoints(NoExBound(i+k, x), NoExBound(j+l, y)))
                        Maxpoints(i,j) = 0;
                    end
                end
            end
        end
    end
end

function n = NoExBound(n,m)
    if(n < 1)
        n = 1;
    elseif(n > m)
        n = m;
    else
        n=n;
    end
end

function newblock = FormatBlock(block)
    newblock = zeros(size(block));
    newblock(1) = block(1);
    newblock(2) = block(2);
    newblock(3) = block(3);
    newblock(4) = block(5);
    newblock(5) = block(7);
    newblock(6) = block(9);
    newblock(7) = block(11);
    newblock(8) = block(13);
    newblock(9) = block(16);
    newblock(10) = block(15);
    newblock(11) = block(14);
    newblock(12) = block(12);
    newblock(13) = block(10);
    newblock(14) = block(8);
    newblock(15) = block(6);
    newblock(16) = block(4);
end