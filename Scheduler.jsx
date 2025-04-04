import { useState, useEffect, useCallback } from "react";

import moment from "moment";
import dayjs from "dayjs";

import Calendar from "./Calendar";
import CustomEvent from "./Event";
import EventModal from "./EventModal";
import { createNewEvent, EventView } from "./Event";

import "./Scheduler.css";

/* The Scheduler ReactJS component built on top of react-big-calendar */
export default function Scheduler(evt) {
    const components = {        
        month: {
            /* Passes the view to event rendering to customise the look */
            event: (e) => {
                const {event,} = e
                const info = event.info;
                return <CustomEvent info={ info } view={ EventView.Month }/>
            }
        },
        week: {
            /* Passes the view to event rendering to customise the look */
            event: (e) => {
                const {event,} = e
                const info = event.info;
                return <CustomEvent info={ info } view={ EventView.Week }/>
            }
        }
    };

    //
    const [eventIndex, setEventIndex] = useState(-1); // since 0 is a valid index
    const [eventsArray, setEvents] = useState(evt.events);
    const [modalState, setModalState] = useState({ isVisible: false });

    // Shows the event modal to create new events
    function showModal(start, end) {
        var mstate = {
            date: start ? dayjs(start) : undefined,
            startTime: start ? dayjs(start) : undefined,
            endTime: end ? dayjs(end) : undefined,
            isVisible: true
        };
        setModalState(mstate);
    }

    function closeModal() {
        setModalState({
            isVisible: false
        });
    }

    // Select a slot to create an event
    const handleSlotSelect = useCallback(
        ({ start, end }) => {
            showModal(start, end);
        },
        [modalState]
    );

    // Create a new Event
    const handleNewEvent = useCallback((details) => {
        closeModal();
        var newEvent = createNewEvent({ ...details, isDraggable: true });
        setEvents([...eventsArray, newEvent]);
    }, [eventsArray]);

    // Handle drag drop for the event
    const handleEventDrop = useCallback(({ event, start }) => {
        var length = moment(event.end).diff(event.start);
        var end = moment(start).add(length, "ms").toDate();
        var newEventArray = eventsArray.map(
            (evt) => {
                return evt.id == event.id ? {
                    ...evt, start, end
                } : evt;
            }
        );
        setEvents(newEventArray);
    }, [eventsArray]);

    // Handle resize of an event. Note that we don't check if the view allows
    // resizing. This is because the resizable attribute is set only if the view
    // is WEEK
    const handleEventResize = useCallback(({ event, start, end }) => {
        var newEventArray = eventsArray.map(
            (evt) => {
                return evt.id == event.id ? {
                    ...evt, start, end
                } : evt;
            }
        );
        setEvents(newEventArray);   
    }, [eventsArray]);

    // Handle the delete button to delete the event
    useEffect(
        () => {
            const handleKeyPress = (event) => {
                switch (event.key) {
                    case "Delete":
                    case "Backspace":
                        if (eventIndex >= 0) {
                            setEvents((eventsList) => eventIndex ? [
                                ...eventsList.slice(0, eventIndex), 
                                ...eventsList.slice(eventIndex+1)
                            ] : [...eventsList.slice(1)]);
                            setEventIndex(-1);
                        }
                        break;
                }
            };

            window.addEventListener("keydown", handleKeyPress);
            return () => { window.removeEventListener("keydown", handleKeyPress); };
        }, 
        [eventsArray, eventIndex]
    );
      
    return (
        // Gives a common ancestor to Calendar and EventModal
        <>
            <Calendar 
                components={ components }
                events={ eventsArray }

                onEventDrop={ handleEventDrop }
                onEventResize={ handleEventResize }
                onSelectSlot={ handleSlotSelect }
                onSelectEvent={ (event) => setEventIndex(eventsArray.findIndex((e) => event.id == e.id)) }

                formats={
                    {
                        dayHeaderFormat: (dt) => moment(dt).format("dddd, MMM Do YYYY"),
                        dayRangeHeaderFormat: (range) => "",
                        monthHeaderFormat: (dt) => moment(dt).format("MMMM YYYY")
                    }
                }
            />

            <EventModal 
                visible={ modalState.isVisible } 
                onCreate={ (fields)=>handleNewEvent(fields) } 
                onCancel={ closeModal } 
                date={ modalState.date ? modalState.date : undefined }
                startTime={ modalState.startTime ? modalState.startTime : undefined }
                endTime={ modalState.endTime ? modalState.endTime : undefined}
            />
        </>
    );
}


