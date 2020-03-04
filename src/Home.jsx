import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { mdiArrowLeftThick } from '@mdi/js';
import Icon from '@mdi/react'
import { mdiArrowRightThick } from '@mdi/js';
import Graph from './Graph';
let xaxis = [3, 6, 9, 12, 15, 18, 21, 24]

const useStyles = makeStyles({
    root: {
        width: 200,
    }
});

const formatDate = (date) => {
    const formatDate = new Date(date);
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return formatDate.getDate() + ' ' + monthNames[formatDate.getMonth()] + ' ' + formatDate.getFullYear();
}

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedValue, setSelectedValue] = useState('c');
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(2);
    const [filteredData, setFilteredData] = useState(4);
    const classes = useStyles();

    async function fetchData(tempType = 'c') {
        let result = ''
        let url = tempType === 'c' ? ('http://api.openweathermap.org/data/2.5/forecast?q=Munich,de&units=metric&APPID=75f972b80e26f14fe6c920aa6a85ad57&cnt=40') :
            ('http://api.openweathermap.org/data/2.5/forecast?q=Munich,de&units=imperial&APPID=75f972b80e26f14fe6c920aa6a85ad57&cnt=40');
        result = await axios(url);
        const data = result.data.list.reduce((days, row) => {
            const date = formatDate(row.dt_txt.split(' ')[0]);
            days[date] = [...(days[date] ? days[date] : []), row];
            return days;
        }, {});
        setData(data);

        let filterData = [];

        Object.keys(data).forEach((key, index) => {
            if (index >= startIndex && index <= 2) {
                filterData = { ...filterData, [key]: data[key] }
            }
        })
        setFilteredData(filterData);
        const chartValue = Object.keys(filterData).map(key =>
            data[key])[0].map((obj, index) => { return { time: xaxis[index], yAxis: obj.main.temp } })
        setChartData(chartValue);
        setSelectedValue(tempType);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const onClick = (key) => {
        const obj = data[key];
        const chartValue = obj.map((yValue, index) => { return { time: xaxis[index], yAxis: yValue.main.temp } })
        setChartData(chartValue);
    }

    const handleChange = event => fetchData(event.target.value);
    const updateFilter = (index1, index2) => {
        let filterData = [];

        Object.keys(data).forEach((key, index) => {
            if (index >= index1 && index <= index2) {
                filterData = { ...filterData, [key]: data[key] }
            }
        })
        setFilteredData(filterData);
        const chartValue = Object.keys(filterData).map(key =>
            data[key])[0].map((obj, index) => { return { time: xaxis[index], yAxis: obj.main.temp } })
        setChartData(chartValue)
    }

    const onLeftClick = event => {
        if (endIndex < 4) {
            setStartIndex(startIndex + 1)
            setEndIndex(endIndex + 1)
            updateFilter(startIndex + 1, endIndex + 1);
        }
    }
    const onRightClick = event => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1)
            setEndIndex(endIndex - 1);
            updateFilter(startIndex - 1, endIndex - 1);
        }
    }

    return (
        <div>
            <RadioGroup aria-label="position" name="position" value={selectedValue} onChange={handleChange} row>
                <FormControlLabel
                    value="top"
                    control={<Radio
                        checked={selectedValue === 'c'}
                        onChange={handleChange}
                        value="c"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'A' }}
                    />}
                    label="Celcius"
                    labelPlacement="End"
                />
                <FormControlLabel
                    value="start"
                    control={<Radio
                        checked={selectedValue === 'f'}
                        onChange={handleChange}
                        value="f"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'B' }}
                    />}
                    label="Fahrenheit"
                    labelPlacement="End"
                />
            </RadioGroup>
            <Icon path={mdiArrowRightThick}
                title="User Profile"
                size={3}
                horizontal
                vertical
                color="black"
                onClick={onRightClick}
            />
            <span style={{ display: 'inline-block', width: 300 }} />
            <Icon path={mdiArrowLeftThick}
                title="User Profile"
                size={3}
                horizontal
                vertical
                color="black"
                onClick={onLeftClick}
            />
            {isLoading ? (<div>Loading ...</div>) :
                <GridList cols={3}>
                    {Object.keys(filteredData).map(key =>
                        <GridListTile>
                            <CardActionArea onClick={() => onClick(key)}>
                                <Card className={classes.root}>
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            Temp: {data[key][0].main.temp}
                                        </Typography>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            Date: {key}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </GridListTile>
                    )}
                </GridList>}
            <Graph chartData={chartData} />
        </div >
    );
}

export default Home;
