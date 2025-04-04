import { Divider, Flex, Typography } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";

const { Text } = Typography;
const EventColor = {
    ToDo: { bg: "#bee2fa", fg: "black" },
    Study: { bg: "#c7edca", fg: "black" },
    Holiday: { bg: "#999999", fg: "black" }
};

dayjs.extend(customParseFormat);

export default function CustomEvent({ info, view }) {
  const { title, desc, evtType } = info;
  const background = EventColor[evtType].bg;
  const foreground = EventColor[evtType].fg;

  return (
    view == EventView.Month ?
        (   /* Month view */
            <div style={{ background, padding: 1, height: "100%", width: "100%", color: foreground, borderStyle: "solid", borderWidth: "1px", borderColor: "#cccccc"}}>
                <Flex align="center" justify="center" style={{ height: "100%" }}>
                    <Text style={{ fontSize: 10 }}>{title}</Text>
                </Flex>
            </div>
        ) 
        :
        (   /* Week view */
            <div style={{ height: "100%", width: "100%" }}>
                <div style={{ background, padding: 1, minHeight: "fit-content", maxHeight: "fit-content", color: foreground }}>
                    <Flex align="center" justify="space-between">
                        <Text style={{ fontSize: 10 }}>{title}</Text>
                        <Text style={{ fontSize: 10 }}>{evtType}</Text>
                    </Flex>
                </div>
      
                <Divider style={{ margin: 0, backgroundColor: "lightgreen" }} />
      
                <div style={{ background, padding: 1, height:"100%", color: foreground }}>
                    <Flex align="center" justify="space-between">
                        <Text style={{ fontSize: 10 }}>{desc}</Text>
                    </Flex>
                </div>
            </div>      
        )
  );
}

const EventTypes = {
    Todo: "ToDo",
    Study: "Study",
    Holiday: "Holiday",
};

const EventView = {
    Day: "day",
    Week: "week",
    Month: "month"
}

var id = 0;

function newEvent(start, end, isDraggable, info) {
    return {
        id: ++id,
        start: start.toDate(),
        end: end.toDate(),
        isDraggable,
        info
    };
}

function evtInfo(title, desc, evtType) {
    return {
        title, 
        desc, 
        evtType
    };
}

function toDateTime(date, time) {
    var dateTime = new Date(date.year(), date.month(), date.date(), time.hour(), time.minute());
    return dateTime;
}
  
function createNewEvent(details) {
    var startDateTime = toDateTime(dayjs(details.date, "YYYY-MM-DD"), dayjs(details.startTime, "HH:MM"));
    var endDateTime = toDateTime(dayjs(details.date, "YYYY-MM-DD"), dayjs(details.endTime, "HH:MM"));

    return newEvent(
            moment(startDateTime), moment(endDateTime), 
            details.isDraggable,
            evtInfo(details.title, details.description, details.type));
}
  
export {
    EventTypes,
    EventView,
    createNewEvent,
};