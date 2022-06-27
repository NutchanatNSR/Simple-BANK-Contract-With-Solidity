import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import moment from "moment";

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../src/config";

function App() {
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [balance, setBalance] = useState("");
  const [account, setAccount] = useState(); // state variable to set account.
  const [detail, setDetail] = useState();
  const [errorMessageD, setErrorMessageD] = useState(""); //D is Deposit
  const [errorMessageW, setErrorMessageW] = useState(""); //W is Withdraw

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.requestAccounts();

      setAccount(accounts[0]);
    }

    load();
  }, []);

  const getContract = () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  };

  const onSubmitDes = () => {
    const Contract = getContract();

    if (deposit.trim().length !== 0) {
      Contract.methods
        .Deposit(parseInt(deposit))
        .send({ from: account })
        .then((res) => {
          console.log(res);
          readBalance();
        })
        .catch((err) => console.log(err));

      setDeposit("");
      setErrorMessageD("");
    } else {
      setErrorMessageD("Please enter your deposit !");
    }
  };

  const onSubmitWid = () => {
    const Contract = getContract();

    if (withdraw.trim().length !== 0) {
      Contract.methods
        .Withdraw(parseInt(withdraw))
        .send({ from: account })
        .then((res) => {
          console.log(res);
          readBalance();
        })
        .catch((err) => console.log(err));

      setWithdraw("");
      setErrorMessageW("");
    } else {
      setErrorMessageW("Please enter your withdraw !");
    }
  };

  const readBalance = () => {
    const Contract = getContract();

    Contract.methods
      .myBalance()
      .call({ from: account })
      .then((res) => {
        console.log(res);
        setBalance(res);
      })
      .catch((err) => console.log(err));
  };

  const getBankList = () => {
    const Contract = getContract();

    Contract.methods
      .myBankbook()
      .call({ from: account })
      .then((res) => {
        console.log(res);
        setDetail(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <div className="rightText">
        <h6>Your account is :</h6>
        <p>{account}</p>
      </div>
      <h2 className="margin-bank text-center text-primary">• 𝓑𝓐𝓝𝓚 •</h2>
      <div>
        <input
          className="p-1 bg-light border bordRdIP"
          pattern="[0-9]*"
          type="number"
          value={deposit}
          min="1"
          id="deposit"
          checked={deposit}
          // onChange={(e) => setDeposit(e.target.value)}
          onChange={(e) =>
            setDeposit((v) => (e.target.validity.valid ? e.target.value : v))
          }
          placeholder="Enter your deposit"
        />
        <button
          className="btn btn-outline-success button-D"
          onClick={onSubmitDes}
        >
          Deposit
        </button>
        {errorMessageD ? <div className="errMsg">{errorMessageD}</div> : null}
      </div>
      <br></br>
      <div>
        <input
          className="p-1 bg-light border bordRdIP"
          pattern="[0-9]*"
          type="number"
          value={withdraw}
          min="1"
          id="withdraw"
          checked={withdraw}
          // onChange={(e) => setWithdraw(e.target.value)}
          onChange={(e) =>
            setWithdraw((v) => (e.target.validity.valid ? e.target.value : v))
          }
          placeholder="Enter your withdraw"
        />
        <button className="btn btn-outline-danger" onClick={onSubmitWid}>
          Withdraw
        </button>
        {errorMessageW ? <div className="errMsg">{errorMessageW}</div> : null}
      </div>
      &nbsp;&nbsp;
      {balance ? (
        <div className="text"> Your Balance is : {balance}</div>
      ) : null}
      <br></br>
      <button
        className="btn btn-outline-primary button-bankbook"
        onClick={getBankList}
      >
        Show Bankbook
      </button>
      {detail ? (
        <div className="scoll Margin-Block">
          <table className="table table-center">
            <thead className="table-dark">
              <tr>
                <th>Account</th>
                <th>Doposit</th>
                <th>Withdraw</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody className="table-dark">
              {detail
                ? detail.map((val, key) => {
                    return (
                      <tr key={key}>
                        <td>{val.owner}</td>
                        <td>{val.amt_deposit}</td>
                        <td>{val.amt_withdraw}</td>
                        <td>
                          {moment.unix(val.time).format("lll").toString()}
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default App;
