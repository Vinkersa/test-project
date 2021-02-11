import React, {createRef, useEffect, useState} from "react";
import {API_KEY, URL, INTRADAY, TIMEOUT_5_MIN, UPDATE_TIME} from "../../config/constants";
import MyChart from "../MyChart";
import priceInterface from "../../models/priceInterface";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const Main: React.FC = () => {
    const classes = useStyles();
    const [data, setData] = useState<priceInterface[]>(getEmptyArray())
    const [chart, setChart] = useState<string>('')
    const [intervalID, setIntervalID] = useState<any>()
    const [numberOfValues, setNumberOfValues] = useState<number>(100)

    function getEmptyArray(): priceInterface[] {
        const emptyArray: priceInterface[] = [];
        return emptyArray;
    }

    function getData(URL: string, stockTimeSeries: string, symbol: string, interval: string, apiKey: string): Promise<any> {
        return fetch(`${URL}function=${stockTimeSeries}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`).then(response => {
            return response.json();
        })
    }

    function fillArray(chart: string): Promise<priceInterface[]> {
        return getData(URL, INTRADAY, chart, TIMEOUT_5_MIN, API_KEY).then(response => {
            try {
                return Object.entries(response['Time Series (5min)']).reduce((res: priceInterface[], item, index) => {
                    res.push({...item[1] as Object, date: item[0]} as priceInterface)
                    return res;
                }, [])
            } catch (err) {
                console.log(err)
                return getEmptyArray();
            }
        })
    }

    function callWithInterval(chart: string, numberOfValues: number) {
        fillArray(chart).then((res: priceInterface[]) => {
            setData(res.reverse().slice(0, numberOfValues))
        })
    }

    function handleChange(event: any) {
        if (event.target.name === 'numberOfValues') {
            setNumberOfValues(event.target.value)
        } else if (event.target.name === 'chart') {
            setChart(event.target.value)
        }
    }

    useEffect(() => {
        setData(getEmptyArray())
        if (intervalID) {
            clearInterval(intervalID)
        }
        if (chart) {
            callWithInterval(chart, numberOfValues)
            setIntervalID(setInterval(callWithInterval, UPDATE_TIME, chart, numberOfValues))
        }
    }, [chart, numberOfValues])


    return <div>
        <div style={{textAlign: "center"}}>
            <FormControl className={classes.formControl}>
                <InputLabel>Charts</InputLabel>
                <Select
                    value={chart}
                    name={'chart'}
                    onChange={handleChange}
                >
                    <MenuItem value={'IBM'}>IBM</MenuItem>
                    <MenuItem value={'GOOGL'}>GOOGL</MenuItem>
                    <MenuItem value={'GOOG'}>GOOG</MenuItem>
                </Select>
            </FormControl>
        </div>
        {chart &&
            <MyChart data={data} title={chart} textAxisY={'Price'} line1={'1. open'} line2={'2. high'}
                     line3={'3. low'} line4={'4. close'} dataKeyX={'date'}/>}
        {chart &&
            <div style={{textAlign: "center"}}>
                <FormControl className={classes.formControl}>
                    <Select
                        value={numberOfValues}
                        name={'numberOfValues'}
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                    <FormHelperText>Values in the graph</FormHelperText>
                </FormControl>
            </div>
        }
    </div>
}

export default Main;