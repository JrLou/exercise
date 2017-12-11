import React, {Component} from 'react';
import less from './Item.less';

class Item extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div
            {...this.props}
            className={less.payItem + " " + (this.props.select ? less.payItemSelect : "")}
         >
            <div>
               {this.props.children}
            </div>
         </div>
      );
   }
}

Item.contextTypes = {
   router: React.PropTypes.object
};
module.exports = Item;

