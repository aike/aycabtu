#
# usage:
#   python makedata.py > keymap.ts
#

from xml.etree import ElementTree
import html

def show_item(category, item):
  key = item.find("string[@name='Key']")
  if key != None:
    command = item.find("string[@name='Name']")
    print('["' + category + '","[' + key.get('value') + ']","' + command.get('value') + '"],')
  child_category = item.find("string[@name='Name']")
  if category != '':
    category = category + ' - ' + child_category.get('value')
  else:
    category = child_category.get('value')
  for list in item.findall("list[@name='Commands']"):
    for item2 in list.findall('item'):
      show_item(category, item2)


with open('cubase_keymap.xml') as f:
  content = f.read()
content = content.replace('&quot;', "'")
content = content.replace('&lt;', '[')
content = content.replace('&gt;', ']')
content = html.unescape(content)
content = content.replace('&', '&amp;')

print("export const keymaps_win: string[][] = [")
tree = ElementTree.fromstring(content)
for member in tree.findall('member'):
  for list in member.findall('list'):
    for item in list.findall('item'):
      show_item('', item)
print("]")
