from PIL import Image as PILImage
import io
import base64
from models import Image
from openpyxl import load_workbook
from openpyxl.drawing.image import Image as XLImage

def extract_image_from_excel(workbook, worksheet, cell):
    """
    Extract image from Excel cell using openpyxl
    Returns the image in binary format
    """
    try:
        # Get all images in the worksheet
        for image in worksheet._images:
            # Check if image anchor cell matches our target cell
            if (image.anchor._from.col == cell.column - 1 and 
                image.anchor._from.row == cell.row - 1):
                # Get image data directly from the image reference
                img_data = image._data()
                if img_data:
                    # Convert to PIL Image for standardization
                    img = PILImage.open(io.BytesIO(img_data))
                    # Convert to PNG format
                    output = io.BytesIO()
                    img.save(output, format='PNG')
                    output.seek(0)
                    return output.getvalue()
        return None
    except Exception as e:
        print(f"Error extracting image: {e}")
        return None

def get_image_base64(image_data):
    """
    Convert binary image data to base64 string for HTML display
    """
    if not image_data:
        return None
    try:
        base64_str = base64.b64encode(image_data).decode('utf-8')
        return base64_str
    except Exception as e:
        print(f"Error converting image to base64: {e}")
        return None