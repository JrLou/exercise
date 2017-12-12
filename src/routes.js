import React from "react";

const {Router, Route, IndexRoute, Redirect, browserHistory} = require("react-router");
const root = (
    <Router history={browserHistory}>
        <Route path="/" getComponent={(nextState, cb) => {
            require.ensure([], require => {
                cb(null, require("./main/body/index/Index.js"));
            }, "Index");
        }}
        >
        </Route>
        <Route
            path="/Echarts"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts/Echarts.js"));
                    }, "Echarts");
                }
            }>
        </Route>
        <Route
            path="/Hexagon"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/hexagon/Hexagon.js"));
                    }, "Hexagon");
                }
            }>
        </Route>
        <Route
            path="/Hexagon02"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/hexagon/Hexagon02.js"));
                    }, "Hexagon02");
                }
            }>
        </Route>
    </Router>
);
module.exports = root;