import '../stylesheets/styles.css'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { default as ipfsAPI } from 'ipfs-api'
import { default as buffer } from 'buffer'

import authorityOracleArtifacts from '../../build/contracts/AuthorityOracle.json'
import medTraceArtifacts from '../../build/contracts/MedTrace.json'
import medicineArtifacts from '../../build/contracts/Medicine.json'

let AuthorityOracle = contract(authorityOracleArtifacts)
let MedTrace = contract(medTraceArtifacts)
let Medicine = contract(medicineArtifacts)
let accounts
let account
let ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

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
        alert('Could not get any accounts!')
        return
      }

      accounts = accs
      account = accounts[0]
      console.log(accounts)
      self.populateAuthorityTabTables()
      self.initAccordions()
    })
  },

  populateAuthorityTabTables: function () {
    this.clearStatus()
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
    let address = document.getElementById('address').value
    self.setStatus('Adding to authorized... (please wait)')
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.addToAuthorized(address, { from: account })
    }).then(function () {
      self.setStatus('Successfully added to authorized addresses!')
      self.getAuthorized('authority_table')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error while adding to authorized addresses. See log.')
    })
  },

  addToProducers: function () {
    let self = this
    let address = document.getElementById('address').value
    self.setStatus('Adding to producers... (please wait)')
    let oracle
    AuthorityOracle.deployed().then(function (instance) {
      oracle = instance
      return oracle.addToProducers(address, { from: account })
    }).then(function () {
      self.setStatus('Successfully added to producer addresses!')
      self.getProducers('producers_table')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error while adding to producer addresses. See log.')
    })
  },

  addToTraders: function () {
    let self = this
    let address = document.getElementById('address').value
    self.setStatus('Adding to traders... (please wait)')
    AuthorityOracle.deployed().then(function (instance) {
      return instance.addToTraders(address, { from: account })
    }).then(function () {
      self.setStatus('Successfully added to traders addresses!')
      self.getTraders('traders_table')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error while adding to traders addresses. See log.')
    })
  },

  setStatus: function (message) {
    let status = document.getElementById('status')
    status.innerHTML = message
  },

  clearStatus: function () {
    document.getElementById('status').innerHTML = ''
  },

  createMed: function (docHash) {
    let self = this
    let name = document.getElementById('name').value
    let batchNumber = parseInt(document.getElementById('batch_number').value)
    let id = parseInt(document.getElementById('id').value)
    let form = document.getElementById('form').value
    let expirationDate = document.getElementById('exp_date').value
    let price = parseInt(document.getElementById('price').value)
    let docComments = document.getElementById('doc_comments').value
    let date = new Date(expirationDate).getTime()
    self.setStatus('Submitting information about produced medicine... (please wait)')
    MedTrace.deployed().then(function (instance) {
      return instance.produceMed(form, name, batchNumber, id,
        date / 1000, web3.toWei(price, 'wei'),
        docHash, docComments, { from: account })
    }).then(function () {
      self.setStatus('Successfully added information about produced medicine!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error while adding information. See log.')
    })
  },

  produce: function () {
    let self = this
    let reader = new FileReader()
    reader.onloadend = function () {
      let buf = buffer.Buffer(reader.result)
      ipfs.files.add(buf, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          self.createMed(result[0].hash)
        }
      })
    }
    const doc = document.getElementById('doc')
    reader.readAsArrayBuffer(doc.files[0])
  },

  addAccordionEventListeners: function () {
    let acc = document.getElementsByClassName('accordion')
    let i
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active')
        let panel = this.nextElementSibling
        if (panel.style.display === 'block') {
          panel.style.display = 'none'
        } else {
          panel.style.display = 'block'
        }
      })
    }
  },

  createMedInfoAccordion: function (medInfo) {
    this.clearAllElements('accordions_content')
    let medInfoPanel = document.getElementById('accordions_content')
    let batchNumberAcc = document.createElement('button')
    batchNumberAcc.className = 'accordion'
    batchNumberAcc.appendChild(document.createTextNode('Batch Number: ' + medInfo[9].toString()))
    medInfoPanel.appendChild(batchNumberAcc)
    let panel = document.createElement('div')
    panel.className = 'panel'
    let content = document.createElement('p')
    this.createMedInfo(content, medInfo)
    panel.appendChild(content)
    medInfoPanel.appendChild(panel)
    this.addAccordionEventListeners()
  },

  createMedInfo: function (parent, medInfo) {
    parent.appendChild(document.createTextNode('Med Information: '))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createTextNode('name: ' + medInfo[3]))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createTextNode('form: ' + medInfo[2]))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createTextNode('current owner: ' + medInfo[0]))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createTextNode('producer: ' + medInfo[1]))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createTextNode('price: ' + medInfo[6]))
    parent.appendChild(document.createElement('br'))
    parent.appendChild(document.createElement('br'))
    let docLink = document.createElement('a')
    docLink.setAttribute('href', 'https://ipfs.io/ipfs/' + medInfo[4])
    docLink.innerHTML = medInfo[5];
    parent.appendChild(docLink)
  },

  clearAllElements: function (id) {
    let acc = document.getElementById(id)
    while (acc.lastChild) {
      acc.removeChild(acc.lastChild)
    }
  },

  initAccordions: function () {
    this.clearAllElements('accordions_content')
  },

  searchByBoth: function () {
    let self = this
    let batchNumber = parseInt(document.getElementById('batch_num').value)
    let id = parseInt(document.getElementById('med_id').value)
    MedTrace.deployed().then(function (instance) {
      instance.getMedAddress(batchNumber, id, { from: account }).then(function (medAddress) {
        let medicineContract = Medicine.at(medAddress)
        medicineContract.getMedInfo.call().then(function (result) {
          self.createMedInfoAccordion(result)
        }).catch(function (e) {
          console.log(e)
          self.setStatus('Error while getting med information. See log.')
        })
      })
    })
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
