import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Legend, Tooltip} from 'recharts';
import {Paper, Typography} from "@material-ui/core";
import clsx from "clsx";

type Props = {
    data: object[],
    dataKeyX: string,
    line1: string,
    line2: string,
    line3: string,
    line4: string,
    title: string,
    textAxisY: string
}
//hello
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        margin: '3vw 8vw',
    },
    fixedHeight: {
        height: 450,
    },
}))

const MyChart: React.FC<Props> = (props) => {

    const {data, dataKeyX, line1, line2, line3, line4, title, textAxisY} = props;
    const theme = useTheme();
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <React.Fragment>
            <Paper className={fixedHeightPaper}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    {title}
                </Typography>
                <ResponsiveContainer>
                    <LineChart data={data}
                               margin={{top: 16, right: 16, bottom: 0, left: 24}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={dataKeyX} tickCount={22} stroke={theme.palette.text.secondary}/>
                        <YAxis type="number" domain={[`dataMin - 1`, 'dataMax + 1']} stroke={theme.palette.text.secondary}>
                            <Label angle={270}
                                   position="left"
                                   style={{textAnchor: 'middle', fill: theme.palette.text.primary}}>
                                {textAxisY}
                            </Label>
                        </YAxis>
                        <Tooltip isAnimationActive={false}/>
                        <Legend/>
                        <Line type="monotone" dataKey={line1} stroke='#29A55B' dot={false}/>
                        <Line type="monotone" dataKey={line2} stroke='#EC4397' dot={false}/>
                        <Line type="monotone" dataKey={line3} stroke='#1212E9' dot={false}/>
                        <Line type="monotone" dataKey={line4} stroke='#FF6A1F' dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </React.Fragment>
    );
}

export default MyChart;