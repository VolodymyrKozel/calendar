'use client'
import { DayGridView } from "@fullcalendar/daygrid/internal.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {Draggable, DropArg}  from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Transition, Dialog, Fragment } from "@headlessui/react";
/* import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; */

import Image from "next/image";
import { useEffect, useState } from "react";

  interface Event {
    id: number;
    title: string;
    start: Date | string;
    allDay: boolean;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "test",
      start: new Date(),
      allDay: true,
    },
    {
      id: 2,
      title: "test2",
      start: new Date(),
      allDay: true, 
    },
    {
      id: 3,
      title: "test3",
      start: new Date(),
      allDay: true, 
    },
    {
      id: 4,
      title: "test4",
      start: new Date(),
      allDay: true, 
    },
  ]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(0);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    start: "",
    allDay: false,
  })

  useEffect(() => {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function(eventEl) {
          return {
            title: eventEl.getAttribute("title"),
            id: eventEl.getAttribute("data"),
            start: eventEl.getAttribute("start"),
          };
        },
      });
    }
  }, [])

  function handleDateClick(arg: {
    date: Date, allDay: boolean}): void {
    setNewEvent({ ...newEvent, start: arg.date, allDay: arg.allDay, id: Date.now()})
    setShowModal(true);
  }
  function addEvent(data: DropArg): void {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: Date.now() }
    setAllEvents([...allEvents, event]);
    setShowModal(false);
  }

  function handleDeleteModal(data: { event: { id: string } }): void {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }
  function handleDelete(): void {
    if (idToDelete) {
      setAllEvents(allEvents.filter((event) => Number(event.id) !== Number(idToDelete)));
      setShowDeleteModal(false);
    }
  }
  function handleCloseModal(): void {
    setShowModal(false);
    setNewEvent({ ...newEvent, title: "", start: "", allDay: false, id: 0 });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }
  return (
    <>
      <nav className="flex items-center justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="text-2xl font-bold text-gray-700">Calendar</h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[
                  dayGridPlugin,
                  interactionPlugin,
                  timeGridPlugin
                ]}
              headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek'
              }}
              events={allEvents}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={ handleDateClick }
             drop={(data) => addEvent(data)}
              eventClick={(data)=> handleDeleteModal(data)}
              
            />
          </div>
          <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
            <h1 className="font-bold text-lg text-center">Drag Event</h1>
            {
              events.map(event => (
                <div className="fc-event border-2 p-1 m2 w-full rounded-md ml-auto text-center bg-white" title={event.title} key={event.id}>
{event.title}
                </div>
              ))
            }

          </div>
        </div>
        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog as='div' className="relative z-10" onClose={setShowDeleteModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
{/*                         <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                          />    */} 
              </div>
                   
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Delete Event
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this event?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}>
                        Delete
                      </button>
                      <button type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white "
                      onClick={handleCloseModal}
                      >

                      </button>
                    
                      </div>
                    
              </Dialog.Panel>
                </Transition.Child>
        </div>
        </div>
          </Dialog>
        </Transition.Root>
      </main>
    </>
  );
}
            
