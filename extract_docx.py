
import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as zf:
            xml_content = zf.read('word/document.xml')
            
        root = ET.fromstring(xml_content)
        
        # Namespaces can be tricky, typically 'w' is mapped.
        # But we can just search for tags ending in 'p' and 't' if we ignore namespaces or handle them loosely.
        # A more robust way with ElementTree is handling the namespace.
        
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text_parts = []
        
        # Iterate over all paragraphs
        for p in root.findall('.//w:p', ns):
            p_text = []
            # Iterate over all runs/text in the paragraph
            for t in p.findall('.//w:t', ns):
                if t.text:
                    p_text.append(t.text)
            
            if p_text:
                text_parts.append(''.join(p_text))
            else:
                text_parts.append('') # Preserve empty lines/spacing
                
        return '\n'.join(text_parts)
        
    except Exception as e:
        return f"Error extracting {docx_path}: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <path_to_docx> [output_file]")
        sys.exit(1)
        
    path = sys.argv[1]
    text = extract_text(path)
    
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully wrote to {output_file}")
    else:
        # Fallback to printing but handle encoding if possible, though writing to file is preferred
        try:
            print(text)
        except UnicodeEncodeError:
            print(text.encode('utf-8', errors='ignore').decode('utf-8'))
