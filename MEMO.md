## 为全部的包更新依赖

rush add -p "typescript@latest" --dev -m
-m 所有包一起更新
需要目录正确

## 清除一切

rush unlink && git clean -dfx

## 重安一遍

rush update

## 构建

rush rebuild -f from -t to -v -o only
-v verbose

## 发包
先
rush change
rush change --bulk --message xxx --bump-type
再
rush version --bump // 这玩意有的时候会生成一个 version update only，不知道原因，即使真的有 change，或许和时间有关

这个时候就可以提交了

rush build
rush publish --include-all --publish