import { Component } from 'react';
import NavMenu from '../NavMenu/NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <div className='flexCenter'>
          {this.props.children}
        </div>
      </div >
    );
  }
}
