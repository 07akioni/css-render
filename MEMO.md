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
再
rush version --bump