import { useState } from "react";
import {
    Calendar as BigCalendar,
    Views,
    momentLocalizer,
} from "react-big-calendar";
import withDragandDrop, { withDragandDropProps } from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import moment from "moment";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragandDrop(BigCalendar);

/* A calendar with drag-n-drop and Month and Week views */
export default function Calendar(props) {
    const [view, setView] = useState(Views.WEEK);
    const [date, setDate] = useState(new Date());
    const [resizable, setResizable] = useState(true); // Since we are starting in Week view
    const { onSelectSlot } = props;

    var lizer = {
        ...props,
        localizer,
        view,
        date,
        defaultView: view,
        views: [ Views.MONTH, Views.WEEK ],
        showMultiDayTimes: false,
        selectable: true,
        resizable: resizable,
        draggableAccessor:  (event) => event.isDraggable, // Enable drag-drop
        onView: (vw) => { // Set the new view
            setView(vw);
            if (vw == Views.MONTH) {
                setResizable(false); // Disable resizing on Month views
            } else {
                setResizable(true); // Enable resizing on Week views
            }
        },
        onNavigate: (dt) => setDate(new Date(dt)),
        onSelectSlot: ({ start, end }) => {
            /* In month view, the end-day is exclusive */
            if (view === "month" && !moment(end).subtract(1, 'day').isSame(start, "day")) {
                return;
            }
            // Hand off to the parent control to create the event
            if (onSelectSlot) onSelectSlot({ start, end });
        }
    };   
    return <DnDCalendar { ...lizer } />
}