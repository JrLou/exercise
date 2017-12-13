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
            path="/Echarts-gl"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts-gl/Echarts.js"));
                    }, "Echarts-gl");
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
        <Route
            path="/Echarts-pie"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts/echarts-pie/Pie.js"));
                    }, "Echarts-pie");
                }
            }>
        </Route>
        <Route
            path="/Rank"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/rank/Rank.js"));
                    }, "Rank");
                }
            }>
        </Route>
    </Router>
);
module.exports = root;