import styles from './main.css';
import React from 'react';
import ReactDOM from 'react-dom';

class CrazyCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          id: 1,
          name: 'anywhereCard',
          imageURL: 'https://www.rsb.ru/upload/resize_cache/iblock/990/405_255_175511db9cefbc414a902a46f1b8fae16/99036feec01cf27eef73bcd11e5d41fa.png',
          requirements: {
            income: 0,
            employmentStatus: 'any'
          },
          title: 'The Anywhere Card is available to anyone anywhere',
          details: {
            apr: 'APR 33.9%',
            balanceTransferOfferDuration: 'Balance Transfer Offer Duration: 0 Months',
            purchaseOfferDuration: 'Purchase Offer Duration: 0 Months',
            creditAvailable: 'Credit Available: £300'
          },
          creditAvailableInteger: 300,
          selected: false
        },
        {
          id: 2,
          name: 'studentLifeCard',
          imageURL: 'https://creditkarmacdn-a.akamaihd.net/res/content/reviews/CCUSAA12/title.png',
          requirements: {
            income: 0,
            employmentStatus: 'student'
          },
          title: 'The Student Life Credit Card is only available to customers with an employment status of Student',
          details: {
            apr: 'APR 18.9%',
            balanceTransferOfferDuration: 'Balance Transfer Offer Duration: 0 Months',
            purchaseOfferDuration: 'Purchase Offer Duration: 6 Months',
            creditAvailable: 'Credit Available: £1200'
          },
          creditAvailableInteger: 1200,
          selected: false
        },
        {
          id: 3,
          name: 'liquidCard',
          imageURL: 'https://m.media-amazon.com/images/G/02/UK_CBCC_PLAT/AmazonPlatinum2FINAL.png',
          requirements: {
            income: 16000,
            employmentStatus: 'any'
          },
          title: 'The Liquid Card is a card available to customers who have an income of more than £16000',
          details: {
            apr: 'APR 33.9%',
            balanceTransferOfferDuration: 'Balance Transfer Offer Duration: 12 Months',
            purchaseOfferDuration: 'Purchase Offer Duration: 6 Months',
            creditAvailable: 'Credit Available: £3000'
          },
          creditAvailableInteger: 3000,
          selected: false
        },
      ],
      employmentStatus: 'any',
      income: 0,
      totalCredit: 0
    }
    this.setSelected = this.setSelected.bind(this);
    this.setEmploymentStatus = this.setEmploymentStatus.bind(this);
    this.setIncome = this.setIncome.bind(this);
    this.totalCreditInfo = this.totalCreditInfo.bind(this);
    this.calcTotalCredit = this.calcTotalCredit.bind(this);
  }
  calcTotalCredit() {
    let totalCredit = 0;
    for (const card of Array.from(this.state.cards)) {
      if (card.selected) {
        totalCredit += card.creditAvailableInteger;
      }
    }
    return totalCredit;
  }
  setSelected(name) {
    const cards = this.state.cards;
    const clickedCard = this.state.cards.find( (item) => item.name == name );
    clickedCard.selected = !clickedCard.selected;
    this.setState({
      cards: cards,
      totalCredit: this.calcTotalCredit()
    });
  }
  setEmploymentStatus(status) {
    const cards = this.state.cards;
    for (const card of Array.from(cards)) {
      if (card.requirements.employmentStatus != 'any' && card.requirements.employmentStatus != status) {
        card.selected = false
      }
    }
    this.setState({
      cards: cards,
      employmentStatus: status,
      totalCredit: this.calcTotalCredit()
    });
  }
  setIncome(income) {
    const cards = this.state.cards;
    for (const card of Array.from(cards)) {
      if (card.requirements.income > income) {
        card.selected = false
      }
    }
    if (income.match(/\d+K$/i)) {
      income = parseInt(income.replace(/K/i, '')) * 1000;
    } else {
      income = parseInt(income.replace(/\D/g, ''))
    }
    this.setState({
      cards: cards,
      income: income,
      totalCredit: this.calcTotalCredit()
    });
  }
  totalCreditInfo() {
    return `Total Credit Available: £${this.state.totalCredit}`;
  }
  render() {
    return (
      <div id='crazy-cards'>
        <CustomerDetailsForm setEmploymentStatus={this.setEmploymentStatus} setIncome={this.setIncome} totalCreditInfo={this.totalCreditInfo} />
        <Cards
          cards={this.state.cards}
          setSelected={this.setSelected}
          employmentStatus={this.state.employmentStatus}
          income={this.state.income} />
      </div>
    )
  }
}
class CustomerDetailsForm extends React.Component {
  render() {
    const setEmploymentStatus = () => {
      const status = ReactDOM.findDOMNode(this.refs.employmentStatus).value || null;
      this.props.setEmploymentStatus(status);
    };
    const setIncome = () => {
      const input = ReactDOM.findDOMNode(this.refs.income).value;
      const income = parseInt(input)? input : '0';
      this.props.setIncome(income);
    };
    return (
      <div className='customer-details-form'>
        <input type='text' ref='income' onChange={setIncome} placeholder='Income (Ex. 30000, 30K)'/>
        <select ref='employmentStatus' onChange={setEmploymentStatus}>
          <option value='any'>Employment Status</option>
          <option value='fullTime'>Full-time</option>
          <option value='partTime'>Part-time</option>
          <option value='student'>Student</option>
        </select>
        <TotalCredit totalCreditInfo={this.props.totalCreditInfo} />
      </div>
    )
  }
}
class Cards extends React.Component {
  render() {
    return (
      <div className='cards'>
        <Card
          cards={this.props.cards}
          setSelected={this.props.setSelected}
          employmentStatus={this.props.employmentStatus}
          income={this.props.income} />
      </div>
    )
  }
}
class Card extends React.Component {
  render() {
    const setSelected = (e) => {
      this.props.setSelected(e.target.name);
    };
    const cards = Array.from(this.props.cards).filter( (item) => {
      return item.requirements.employmentStatus === 'any' && this.props.income >= item.requirements.income
       || (item.requirements.employmentStatus === 'student' && this.props.employmentStatus === 'student')
    });
    const cardItems = cards.map( (item, index) => {
      const selected = item.selected? 'selected' : '';
      return <div className='card' key={index}>
        <label className={selected}>
          <img src={item.imageURL} key={`cardImage_${index}`} draggable='false' />
          <input
            type='checkbox'
            key={`cardCheckbox_${index}`}
            ref={item.id}
            name={item.name}
            checked={item.selected}
            onChange={setSelected} />
        </label>
        <CardDetails details={item.details} title={item.title} />
        <SelectedStatus />
      </div>
    });
    return (
      <div>
        {cardItems}
      </div>
    )
  }
}
class CardDetails extends React.Component {
  render() {
    const details = [];
    for (const i in this.props.details) {
      const val = this.props.details[i];
      details.push(<span key={i}>{val}</span>);
    }
    return (
      <div className='card-details'>
        <span className='card-details__title'>{this.props.title}</span>
        <div className='card-details__details'>{details}</div>
      </div>
    )
  }
}
class SelectedStatus extends React.Component {
  render() {
    return (
      <div className='selected-status'>
        <i className='material-icons'>check</i>
      </div>
    )
  }
}
class TotalCredit extends React.Component {
  render() {
    return (
      <div className='total-credit-info'>
        <span>{this.props.totalCreditInfo()}</span>
      </div>
    )
  }
}

ReactDOM.render(<CrazyCards />, document.querySelector('#root'));
