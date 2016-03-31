# znews-site

API: https://github.com/izzyleung/ZhihuDailyPurify/wiki/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-API-%E5%88%86%E6%9E%90

```
To get latest stories:
http://news.at.zhihu.com/api/4/news/latest

To get stories for a specific date
http://news.at.zhihu.com/api/4/news/before/20160304
This will give you 20160303's stories

The datetime seems to be CST
```

## Daily download

```bash
$ node index download
# it would fetch today and yesterday's posts, write to hugo/content/post
```

## Build hugo site (./build-hugo.sh)

```bash
$ cd hugo
$ rm -rf public
$ hugo
# the generated site will be in hugo/public
```

## Deploy the site to github pages (./push-to-github.sh)

```bash
$ cd hugo/public
$ git init
$ echo "znews.site" > CNAME
$ git add .
$ git commit -m "commit message"
$ git remote add origin git@github.com:znewsapp/znews-msite.git
$ git push -f -u origin master:gh-pages
```

## To setup cron

```bash
$ ./downandbuild.sh
```
