import { createNewEvent, EventTypes } from "./Components/Event";

var Events = [
    createNewEvent({
        date: "2025-03-31",
        startTime: "11:30:00", 
        endTime:"12:30:00",
        title: "Title",
        description: "description",
        type: EventTypes.Todo,
        isDraggable: false,
    }),
    createNewEvent({
        date: "2025-03-31",
        startTime: "09:30:00", 
        endTime:"10:30:00",
        title: "Another event",
        description: "Some description",
        type: EventTypes.Study,
        isDraggable: true,
    }),
];

export { Events };