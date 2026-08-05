Add-Type -AssemblyName System.Drawing

$imagePath = 'c:\xampp\htdocs\RT-main\RT-main\assets\images\products\Health mix powder.jpg'
$outPath = 'c:\xampp\htdocs\RT-main\RT-main\assets\images\products\health-mix-powder-800g-front.jpg'

$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# The image is 1.5MB, probably high res, let's say 1000x1000
$width = $bmp.Width
$height = $bmp.Height

# We need to guess where the Net.wt is. In the screenshot, it's bottom right, slightly inside the border.
# Let's write the width and height to a text file so I can read it
$info = "Width: $width, Height: $height"
Set-Content -Path 'c:\xampp\htdocs\RT-main\RT-main\img_info.txt' -Value $info

$graphics.Dispose()
$bmp.Dispose()
