import React, {Component} from 'react';
import less from './Pay.less';

class WindowHelp {
    setPanel(panel){
        this.shareWindow = panel;
    }
    getPanel(){
        return this.shareWindow;
    }
    openInitWindow(panel){
        if(panel){
            this.shareWindow = panel;
            return panel;
        }
        let w = window.screen.width*0.6 ,h = window.screen.height*0.6;
        this.shareWindow  =  window.open('/html/loading.html', 'apinPanel', 'height='+h+', width='+w+', top='+(window.screen.height-h)/2+',left='+(window.screen.width-w)/2+',toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');

        return this.shareWindow;
    }

    openWindow(apinPanel,value){
        if(apinPanel.location){
            //打开URL类型
            apinPanel.location.href = value;
            apinPanel.focus();
        }else{
            //打开自定义类型
            if(apinPanel.show){
                apinPanel.show(true,value);
            }

        }
    }
    closeWindow(apinPanel){
        let panel = apinPanel||this.shareWindow;
        if(panel){
            if(panel.location){
                panel.close();
            }else{
                if(panel.show){
                    panel.show(false);
                }

            }

        }
    }
}
module.exports = WindowHelp;