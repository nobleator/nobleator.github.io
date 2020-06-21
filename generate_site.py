import os
import datetime
from typing import List

EXCLUDE_DIRS = [".git", ".vscode"]

class NavElement:
    def __init__(self, title: str, link: str, summary: str = None, published_on = None, children = [], content = None):
        self.title = title
        self.link = link
        self.summary = summary
        self.published_on = published_on
        self.children = children
        self.content = content

    def __repr__(self):
        return f"{self.title}: {len(self.children)} children"


def expand_all(elements, depth = 0):
   """Expand all placeholder elements and create .html files
   Convert .md file to templated .html versions
   Replace content, asset links, and navigation link prefixes
   """
   for element in elements:
        if element.content:
            with open("template_out.html", "r") as file:
                filedata = file.read()

            depth_prefix = ".\\" + ("..\\" * depth)
            filedata = filedata \
                .replace("##CONTENT", element.content) \
                .replace("##ASSET-LINKS", f"<link rel='stylesheet' type='text/css' href='{depth_prefix}style.css'>") \
                .replace("##PREFIX", depth_prefix)

            with open(f"{element.link}.html", "w") as file:
                file.write(filedata)
        if element.children:
            expand_all(element.children, depth + 1)


def expand_nav(elements):
    """Expand navigation elements including prefix placeholder to be replaced in final call to expand_all
    """
    nav = "<ul>"
    for element in elements:
        nav += "<li>"
        if element.children and len(element.children) > 0:
            nav += f"""<details>
            <summary>{element.title}</summary>
            {expand_nav(element.children)}
            </details>
            """
        else:
            stripped_link = element.link.lstrip(".\\")
            nav += f"<a href='##PREFIX{stripped_link}.html'>{element.title}</a>"
        nav += "</li>"
    nav += "</ul>"
    return nav


def execute():
    nav_list = []
    title = None
    link = None
    summary = None
    published_on = None

    # Parse .md files to pull navigation bar list with summaries and ordering info
    for root, dirs, files in os.walk("."):
        children = []
        for file in files:
            content = []
            _, file_extension = os.path.splitext(file)
            if file_extension == ".md":
                full_path = os.path.join(root, file)
                with open(full_path) as f:
                    content_start = False
                    for line in f.readlines():
                        if content_start:
                            # TODO: Parse markdown to HTML (e.g. lists and links)
                            content.append(line)
                            content.append("<br>")
                        # Metadata processing
                        if "# Title: " in line:
                            title = line.partition("# Title: ")[2:][0].rstrip()
                            link = os.path.split(full_path)[0] + "\\" + title.replace(" ", "-").strip().lower()
                        if "## Summary: " in line:
                            summary = line.partition("## Summary: ")[2:][0].rstrip()
                        if "## PublishedOn: " in line:
                            published_on = line.partition("## PublishedOn: ")[2:][0].rstrip()
                        if "### Content" in line:
                            content_start = True
                    element = NavElement(title, link, summary, published_on, content="".join(content))
                    if root == ".":
                        nav_list.append(element)
                    children.append(element)

        if root != ".":
            title = root.lstrip(".\\").title() + f" ({len(children)})"
            children.sort(key=lambda x: x.published_on if x.published_on else x.title)
            nav_list.append(NavElement(title, title, children=children))  
        
        for d in EXCLUDE_DIRS:
            if d in dirs:
                dirs.remove(d)
    
    nav_list.sort(key=lambda x: x.published_on if x.published_on else x.title)

    # Update template_out.html to include current links to current .md files
    with open("template_in.html", "r") as file:
        filedata = file.read()

    nav = expand_nav(nav_list)
    filedata = filedata.replace("##NAV-LIST", nav)

    with open("template_out.html", "w") as file:
        file.write(filedata)
    
    expand_all(nav_list)


if __name__ == "__main__":
    execute()