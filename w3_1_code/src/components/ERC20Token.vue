<template>
  <div>
    <h2 class="text-2xl text-center text-gray-700">
      一、通过ethers.js调用Tenmile合约进行转账
    </h2>
    <form @submit.prevent="submitTransfer" class="text-center bg-gray-200 p-3">
      <h3 class="text-2xl text-center text-gray-700">1、转账</h3>
      <div class="border py-2">
        <label class="flex text-gray-600">
          转入地址:
          <input class="ml-2 flex-grow bg-white" v-model="formData.account" required />
        </label>
      </div>
      <div class="border py-2">
        <label class="flex text-gray-600">
          转入数量:
          <input class="ml-2 flex-grow bg-white" v-model="formData.amount" required />
        </label>
      </div>
      <button
        class="border border-2 bg-white font-bold my-2 py-1 px-4 font-md"
        type="submit"
      >
        转账
      </button>
    </form>

    <div>
      <h3 class="text-xl my-3">2、余额查询</h3>
      <div class="border py-2">
        <label class="flex text-gray-600">
          查询地址:
          <input
            type="text"
            class="ml-2 flex-grow bg-white"
            v-model="queryAccount"
            placeholder="请输入地址"
          />
        </label>
      </div>
      <button
        class="border border-2 bg-white font-bold my-2 py-1 px-4 font-md"
        @click="queryBalance"
      >
        查询
      </button>
      <p class="text-gray-700 my-3">
        余额为：
        {{ queryAmount }}
      </p>
    </div>
    <hr class="my-8" />
    <h2 class="text-2xl text-center text-gray-700">二、Vault合约</h2>
    <div>
      <br />
      Token名称 : {{ name }} <br />
      Token符号 : {{ symbol }} <br />
      Token精度 : {{ decimal }} <br />
      Token发行量 : {{ supply }} <br />
      我的余额 : {{ balance }}
    </div>
    <h3 class="text-xl my-3">1、存款</h3>
    <div class="border py-2">
      <label class="flex text-gray-600">
        质押量:
        <input class="ml-2 flex-grow bg-white" v-model="stakeDepositeAmount" />
      </label>
    </div>
    <button
      class="border border-2 bg-white font-bold my-2 py-1 px-4 font-md"
      @click="permitDepositeStake"
    >
      授权存款
    </button>

    <h3>2、提取</h3>
    <div class="border py-2">
      <label class="flex text-gray-600">
        提取量:
        <input class="ml-2 flex-grow bg-white" v-model="withdrawAmount" />
      </label>
    </div>
    <button
      class="border border-2 bg-white font-bold my-2 py-1 px-4 font-md"
      @click="withdrawStake"
    >
      授权提取
    </button>
    <h3>3、存款金额</h3>
    <div class="border py-2">
      <p class="text-gray-700 my-3">
        存款金额为：
        {{ vaultAmount }}
      </p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { ethers } from "ethers";
import coronationAddr from "../../deployments/dev/Coronation.json";
import coronationAbi from "../../deployments/abi/Coronation.json";
import tenmileAddr from "../../deployments/dev/Tenmile.json";
import tenmileAbi from "../../deployments/abi/Tenmile.json";
import vaultAddr from "../../deployments/dev/Vault.json";
import vaultAbi from "../../deployments/abi/Vault.json";
import { premitTypedDate } from "../typedData.js";

export default {
  name: "erc20",
  data() {
    return {
      balance: null,
      name: null,
      decimal: null,
      symbol: null,
      supply: null,
      queryAmount: null,
      queryAccount: "",
      formData: reactive({ account: "", amount: "" }),
      stakeDepositeAmount: null,
      withdrawAmount: null,
      vaultAmount: null,
    };
  },
  async created() {
    await this.initAccount();
    await this.initContract();
    await this.initIncreaseTotalSupply();
    this.getNonce();
    this.getInfo();
    this.getVaultInfo();
  },
  methods: {
    async initAccount() {
      if (window.ethereum) {
        console.log("initAccount");
        try {
          this.accounts = await window.ethereum.enable();
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.currProvider = window.ethereum;
          this.provider = new ethers.providers.Web3Provider(window.ethereum);

          this.signer = this.provider.getSigner();
          let network = await this.provider.getNetwork();
          this.chainId = network.chainId;
          console.log("chainId:", this.chainId);
        } catch (error) {
          console.log("User denied account access", error);
        }
      } else {
        console.log("Need install MetaMask");
      }
    },
    async initContract() {
      this.tenmile = new ethers.Contract(
        tenmileAddr.address,
        tenmileAbi.abi,
        this.signer
      );

      this.coronation = new ethers.Contract(
        coronationAddr.address,
        coronationAbi.abi,
        this.signer
      );
      this.vault = new ethers.Contract(vaultAddr.address, vaultAbi.abi, this.signer);
    },
    async initIncreaseTotalSupply() {
      console.log(this.account);
      this.tenmile.increaseTotalSupply(this.account, "100").then((r) => {
        console.log(r);
      });
    },
    async getInfo() {
      this.coronation.name().then((r) => {
        this.name = r;
      });
      this.coronation.decimals().then((r) => {
        this.decimal = r;
      });
      this.coronation.symbol().then((r) => {
        this.symbol = r;
      });
      this.coronation.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18);
      });

      this.coronation.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      });
    },
    getNonce() {
      this.coronation.nonces(this.account).then((r) => {
        this.nonce = r.toString();
        console.log("nonce:" + this.nonce);
      });
    },
    submitTransfer() {
      let amount = ethers.utils.parseUnits(this.formData.amount, 18);
      this.tenmile.transfer(this.formData.account, amount).then((r) => {
        console.log(r);
      });
    },
    queryBalance() {
      this.tenmile.balanceOf(this.queryAccount).then((r) => {
        this.queryAmount = ethers.utils.formatUnits(r, 18);
      });
    },
    permitDepositeStake() {
      this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
      let amount = ethers.utils.parseUnits(this.stakeDepositeAmount).toString();
      let msgParams = premitTypedDate(
        "Coronation ERC2612 Token",
        coronationAddr.address,
        this.account,
        vaultAddr.address,
        amount,
        this.deadline,
        this.chainId,
        this.nonce
      );
      console.log("msgParams:" + msgParams);

      this.currProvider.sendAsync(
        {
          method: "eth_signTypedData_v4",
          params: [this.account, msgParams],
          from: this.account,
        },
        (err, sign) => {
          this.sign = sign.result;
          console.log(this.sign);

          //  椭圆曲线签名签名的值:
          // r = 签名的前 32 字节
          // s = 签名的第2个32 字节
          // v = 签名的最后一个字节

          let r = "0x" + this.sign.substring(2).substring(0, 64);
          let s = "0x" + this.sign.substring(2).substring(64, 128);
          let v = "0x" + this.sign.substring(2).substring(128, 130);

          this.vault
            .permitDeposit(this.account, amount, this.deadline, v, r, s, {
              from: this.account,
            })
            .then(() => {
              this.getInfo();
              this.getNonce();
              this.getVaultInfo();
            });
        }
      );
    },
    withdrawStake() {
      let amount = ethers.utils.parseUnits(this.withdrawAmount).toString();
      this.vault.withdraw(this.account, amount).then(() => {
        this.getInfo();
        this.getNonce();
        this.getVaultInfo();
      });
    },
    getVaultInfo() {
      this.vault.balanceOf(this.account).then((r) => {
        console.log(ethers.utils.formatUnits(r, 18));
        this.vaultAmount = ethers.utils.formatUnits(r, 18);
      });
    },
  },
};
</script>
