import React from "react";

const {Router, Route, IndexRoute, Redirect, browserHistory} = require("react-router");

const App = (nextState, cb) =>
    require.ensure([], (require) => {
        cb(null, require("./main/body/index/Index"));
    }, "App");
const root = (
    <Router history={browserHistory}>
        <Route path="/" getComponent={App}
        >
            <IndexRoute getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/index/Index.js"));
                    }, "Index");
                }
            }/>
            <Route
                getComponent={
                (nextState, cb) => {
                   require.ensure([], require => {
                       cb(null, require("./main/body/echarts/Echarts.js"));
                   }, "Echarts");
                }
            }>
            </Route>
        </Route>
    </Router>
);
module.exports = root;