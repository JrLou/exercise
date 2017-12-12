import React, {Component} from "react";
import less from './Hexagon.less';

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render(){
        const style = {
            borderLength:this.props.borderLength?this.props.borderLength:'80px',
            borderStyle:this.props.borderStyle?this.props.borderStyle:'0px solid #000',
            borderRadius:this.props.borderRadius?this.props.borderRadius:'0px',
            backgroundColor:this.props.backgroundColor?this.props.backgroundColor:'transparent',
            imageUrl:this.props.imageUrl?this.props.imageUrl:'',
            imageSize:this.props.imageSize?this.props.imageSize:'100%',
        };
        let divHeight = this.getHeight(style.borderLength);
        let divWidth = this.getWidth(style.borderLength);
        let divTop = this.getPositionTop(style.borderLength);

        //外框的样式
        let outerBox = {
            borderLeft:style.borderStyle,
            borderRight:style.borderStyle,
            borderRadius:style.borderRadius,
            backgroundColor:style.backgroundColor,
        };

        return(
            <div
                className={less.container}
                style={{
                    width:divWidth,
                    height:divHeight,
                }}
            >
                <div
                    className={less.typeA}
                    style={{
                        width:divWidth,
                        height:style.borderLength,
                        position:'relative',
                        top:divTop,
                        left:0,
                        borderLeft:style.borderStyle,
                        borderRight:style.borderStyle,
                        borderRadius:style.borderRadius,
                        backgroundColor:style.backgroundColor,
                    }}
                >
                    <div
                        className={less.typeB}
                        style={outerBox}
                    >
                    </div>
                    <div
                        className={less.typeC}
                        style={outerBox}
                    >
                    </div>
                </div>
                <div
                    className={less.boxF}
                    style={{
                        position:'absolute',
                        zIndex:9,
                        top:0,
                        left:0,
                        width:divWidth,
                        height:divHeight,
                    }}
                >
                    <div
                        className={less.boxS}
                        style={{
                            width:divWidth,
                            height:divHeight,
                        }}
                    >
                        <div
                            className={less.boxT}
                            style={{
                                width:divWidth,
                                height:divHeight,
                                backgroundImage:`url(${style.imageUrl})`,
                                backgroundSize:style.imageSize,
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //通过变长计算父容器高
    getHeight(x){
        let length = x?parseFloat(x):0;
        let newLength = length*2;
        return (newLength.toFixed(4)+'px');
    }
    //通过变长计算父容器宽
    getWidth(x){
        let length = x?parseFloat(x):0;
        let newLength = Math.cos(Math.PI/6)*length*2;
        return (newLength.toFixed(4)+'px');
    }
    //绝对定位Top值计算
    getPositionTop(x){
        let top = x?parseFloat(x):0;
        let newTop = top/2;
        return (newTop.toFixed(4)+'px');
    }
}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;