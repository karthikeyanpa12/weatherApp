import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';

function Graph(props) {

    return (
        <Paper>
            <Chart data={props.chartData} width={500}>
                <ArgumentAxis />
                <ValueAxis max={7} />
                <BarSeries valueField="yAxis" width={40} argumentField="time" />
                <Title text="Temperature" />
                <Animation />
            </Chart>
        </Paper>
    );
}

export default Graph;
