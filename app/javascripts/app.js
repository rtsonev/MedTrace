import '../stylesheets/styles.css'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import authorityOracleArtifacts from '../../build/contracts/AuthorityOracle.json'
import medTraceArtifacts from '../../build/contracts/MedTrace.json'
import medicineArtifacts from '../../build/contracts/Medicine.json'

let AuthorityOracle = contract(authorityOracleArtifacts)
let MedTrace = contract(medTraceArtifacts)
let Medicine = contract(medicineArtifacts)
let accounts
let account

window.App = {

  start: function () {
    let self = this

    // Bootstrap the all abstractions for Use.
    AuthorityOracle.setProvider(web3.currentProvider)
    MedTrace.setProvider(web3.currentProvider)
    Medicine.setProvider(web3.currentProvider)

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length == 0) {
        alert('Couldn\'t get any accounts!')
        return
      }

      accounts = accs
      account = accounts[0]

      console.log(accounts)

      // self.refreshBalance();
      self.populateAuthorityTabTables()
    })
  },

  populateAuthorityTabTables: function () {
    this.getAuthorized('authority_table')
    this.getProducers('producers_table')
    this.getTraders('traders_table')
  },

  getAuthorized: function (authority_table_name) {
    let self = this
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.getAuthorized.call()
    }).then(function (authorized) {
      self.clearTable(authority_table_name)
      self.populateTable(authority_table_name, authorized)
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting authorized addresses; see log.')
    })
  },

  getProducers: function (producers_table_name) {
    let self = this
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.getProducers.call()
    }).then(function (authorized) {
      self.clearTable(producers_table_name)
      self.populateTable(producers_table_name, authorized)
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting producers addresses; see log.')
    })
  },

  getTraders: function (traders_table_name) {
    let self = this
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.getTraders.call()
    }).then(function (authorized) {
      self.clearTable(traders_table_name)
      self.populateTable(traders_table_name, authorized)
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting traders addresses; see log.')
    })
  },

  openTab: function (evt, tabName) {
    let i, tabcontent, tablinks
    tabcontent = document.getElementsByClassName('tabcontent')
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }
    tablinks = document.getElementsByClassName('tablinks')
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '')
    }
    document.getElementById(tabName).style.display = 'block'
    evt.currentTarget.className += ' active'
  },

  clearTable: function (table_name) {
    let tableHeaderRowCount = 1
    let table = document.getElementById(table_name)
    let rowCount = table.rows.length
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount)
    }
  },

  populateTable: function (table_name, content) {
    let tabBody = document.getElementById(table_name)
    for (let i = 0; i < content.length; i++) {
      let row = document.createElement('tr')
      let cell = document.createElement('td')
      let textnode = document.createTextNode(content[i])
      cell.appendChild(textnode)
      row.appendChild(cell)
      tabBody.appendChild(row)
    }
  },

  addToAuthorized: function () {
    let self = this
    let address = parseInt(document.getElementById('address').value)
    self.setStatus('Adding to authorized... (please wait)')
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.addToAuthorized(address, { from: account })
    }).then(function () {
      self.setStatus('Successfully added to authorized addresses!')
      this.getAuthorized('authority_table')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error while adding to authorized addresses. See log.')
    })
  },

  addToProducers: function () {

  },

  addToTraders: function () {

  },

  setStatus: function (message) {
    let status = document.getElementById('status')
    status.innerHTML = message
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (MetaMask) if not use testrpc in this case
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source.')
    window.web3 = new Web3(web3.currentProvider)
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  App.start()
})
