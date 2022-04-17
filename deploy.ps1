param([string]$additionalMessage) 

"Deploying updates for GitHub pages"
# hugo
# cd public
# git add .
$today = Get-Date
$message = "Rebuilding site and publishing to gh-pages branch on $today"
if ($additionalMessage) {
    $message = $message + ": " + $additionalMessage
}
# git commit -m "$message"
# git push origin master
# cd ..


# remove previous publication
# rm -rf public
"Removing existing .\public directory"
Remove-Item -recurse .\public
"Creating new .\public directory"
mkdir public
# New-Item -ItemType "directory" .\public

"Clone gh-pages branch from the local repo into a repo located within .\public"
git clone .git --branch gh-pages public
  
"Generating site with hugo"
hugo
  
"Committing the changes in the clone and pushing them back to the local gh-pages branch"
cd public && git add --all && git commit -m $message && git push origin gh-pages

"Pushing gh-pages branch"
git push upstream gh-pages

cd ..
"Deployment complete"
