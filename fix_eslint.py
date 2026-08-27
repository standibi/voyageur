import os
import re

def replace_any(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    # Be careful with replacing : any, just replace basic ones.
    content = re.sub(r': any', ': unknown', content)
    with open(file_path, 'w') as f:
        f.write(content)

services_dir = 'src/services'
for f in os.listdir(services_dir):
    if f.endswith('.ts'):
        replace_any(os.path.join(services_dir, f))

replace_any('src/utils/toast.ts')
replace_any('src/utils/transformers.ts')

# Fix transformers.ts unused vars
with open('src/utils/transformers.ts', 'r') as f:
    content = f.read()
content = content.replace("Hotel,\n", "")
content = content.replace("Activity,\n", "")
content = content.replace("Expense,\n", "")
with open('src/utils/transformers.ts', 'w') as f:
    f.write(content)

# Fix trips.ts unused vars
with open('src/services/trips.ts', 'r') as f:
    content = f.read()
content = content.replace("Trip,\n", "")
with open('src/services/trips.ts', 'w') as f:
    f.write(content)

