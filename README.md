# ok-training
ok training homework


## W1-1作业

* 安装Metamask并创建好账号，执行一次转账
<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1645849079015.jpg">
</p>

```
https://kovan.etherscan.io/tx/0x0f097b794f3f16f104378c3e8704434d6833682d3ff74946f0ec98132f985800
```
---

* 使用Remix创建任意一个合约
<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1645850916527.jpg" width="800" height="380">
</p>

---

* VSCode IDE 开发环境配置
<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1645856999343.jpg" width="600" height="380">
</p>

---

* 使用Truffle部署Counter合约到test网络（提交交易hash）
```
https://kovan.etherscan.io/address/0x3Bb1095425d2d10D3945d60C11a761F9e3F74091
```
---

* 编写一个测试用例
* 详见：

- [w1_1_code](https://github.com/hejiujun/ok-training/tree/main/w1_1_code)

---

## W1-2作业

* 使用Hardhat部署修改后的Counter
* 使用Hardhat测试Counter
* 写一个脚本调用count()
* 详见：

- [w1_2_code](https://github.com/hejiujun/ok-training/tree/main/w1_2_code)

---

## W2-1作业

* 编写一个Bank合约
* 通过Metamask向Bank合约转账ETH
* 在Bank合约记录每个地址转账金额
* 编写Bank合约withdraw(),实现提取出所有的ETH

- [w2_1_code](https://github.com/hejiujun/ok-training/tree/main/w2_1_code)

---

## W2-2作业

* 编写合约Score，用于纪录学生（地址）分数
* 仅有老师（用modifier权限控制）可以添加和修改学生分数
* 分数不可以大于100
* 编写合约Teacher作为老师，通过IScore接口调用修改学生分数

- [w2_2_code](https://github.com/hejiujun/ok-training/tree/main/w2_2_code)

---

## W3-1作业

* 发行一个ERC20 Token
* 可动态增发（起始发行量是0）
* 通过ethers.js调用合约进行转账

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1646970788986.jpg">
</p>

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1646970834515.jpg">
</p>

* 编写一个Vault合约
* 编写deposite方法，实现ERC20存入Vault，并记录每个用户存款金额，从前端调用（Approve，transferFrom）
* 编写withdraw方法，提取用户自己的存款（前端调用）
* 前端显示用户存款金额

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647025885635.jpg">
</p>

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647025951764.jpg">
</p>

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647025995473.jpg">
</p>

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647026034150.jpg">
</p>



- [w3_1_code](https://github.com/hejiujun/ok-training/tree/main/w3_1_code)



---


## W3_2作业

* 发行一个ERC721 Token
* 使用ethers.js解析ERC721转账事件（加分项：记录到数据库中，可方便查询用户持有的所有NFT）
* （或）使用TheGraph解析ERC721转账事件
* 测试前先在mysql数据库执行scripts/erc-mysql.sql脚本并确保远程连接数据正常，修改scripts/dbutil.js文件中数据连接配置，测试操作命令如下：

```
npx hardhat compile
npx hardhat test --network dev
npx hardhat run scripts/rose-script.js --network dev
npx hardhat run scripts/transfer.js --network dev
npx hardhat run scripts/getlogs.js --network dev
npx hardhat run scripts/getlogs-mysql.js --network dev

```

<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647156746145.jpg">
</p>
<p align="center">
  <img src="https://github.com/hejiujun/ok-training/blob/main/images/1647156145884.jpg">
</p>


- [w3_2_code](https://github.com/hejiujun/ok-training/tree/main/w3_2_code)

---

## W4_1作业

* 部署自己的ERC20合约MyToken
* 编写合约MyTokenMarket实现：AddLiquidity()函数内部调用UniswapV2Router添加MyToken与ETH的流动性；buyToken()用户可调用该函数实现购买MyToken

- [w4_1_code](https://github.com/hejiujun/ok-training/tree/main/w4_1_code)

---

## W4_2作业

* 在上一次作业的基础上完成代币兑换后，直接质押MasterChef
* withdraw()从MasterChef提取Token方法

- [w4_2_code](https://github.com/hejiujun/ok-training/tree/main/w4_2_code)

---

