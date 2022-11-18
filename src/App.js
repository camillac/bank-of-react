/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super();
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser});
  }

  // Update creditList after credit description + amount is submitted
  addCredit = (e) => {
    e.preventDefault();
    this.setState({ creditList: this.state.creditList.concat([{
      id: crypto.randomUUID(),
      amount: parseFloat(e.target.elements.amount.value).toFixed(2),
      description: e.target.elements.description.value,
      date: new Date().toISOString(),
    }]) });

    this.setState({accountBalance: (parseFloat(this.state.accountBalance) + parseFloat(e.target.elements.amount.value)).toFixed(2)})
  }

  // Update debitList after debit description + amount is submitted
  addDebit = (e) => {
    e.preventDefault();
    this.setState({ debitList: this.state.debitList.concat([{
      id: crypto.randomUUID(),
      amount: parseFloat(e.target.elements.amount.value).toFixed(2),
      description: e.target.elements.description.value,
      date: new Date().toISOString(),
    }]) });

    this.setState({accountBalance: (parseFloat(this.state.accountBalance) - parseFloat(e.target.elements.amount.value)).toFixed(2)})

  }

  // Grabs Credit/Debit data from API
  async componentDidMount(){
    await fetch('https://moj-api.herokuapp.com/credits').then((response) => response.json())
    .then(credits => {
        this.setState({ creditList: credits });
    });
    await fetch('https://moj-api.herokuapp.com/debits').then((response) => response.json())
    .then(debits => {
        this.setState({ debitList: debits});
    });

    let debits = this.state.debitList;
    let credits = this.state.creditList;

    let creditSum=0;
    let debitSum=0;

    debits.forEach((debit) => {
      debitSum += debit.amount;
    })

    credits.forEach((credit) => {
      creditSum += credit.amount;
    })

    let updatedAccountBalance = (creditSum - debitSum).toFixed(2);
    this.setState({accountBalance: updatedAccountBalance});
  }

  // Create Routes and React elements to be rendered using React components
  render() {
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} accountBalance={this.state.accountBalance}/>)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} accountBalance={this.state.accountBalance}/>)

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;
