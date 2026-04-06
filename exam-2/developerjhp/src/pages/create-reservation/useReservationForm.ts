import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TIME_SLOTS } from "@/reservation/constants";
import {
  createReservationFormSchema,
  type ReservationFormInputValues,
  type ReservationFormValues,
} from "@/reservation/schemas/reservation";
import type { Room } from "@/reservation/types";

interface UseReservationFormParams {
  rooms: Room[];
  initialValues: {
    roomId: string;
    date: string;
    startTime: string;
  };
}

function isValidSlot(time: string): boolean {
  return TIME_SLOTS.includes(time);
}

export function useReservationForm({
  rooms,
  initialValues,
}: UseReservationFormParams) {
  const schema = createReservationFormSchema(rooms);
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<ReservationFormInputValues, undefined, ReservationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomId: initialValues.roomId || "",
      date: initialValues.date || "",
      startTime: isValidSlot(initialValues.startTime)
        ? initialValues.startTime
        : "",
      endTime: "",
      title: "",
      organizer: "",
      attendees: 1,
    },
  });

  const roomId = watch("roomId");
  const date = watch("date");
  const startTime = watch("startTime");
  const selectedRoom = rooms.find((room) => room.id === roomId);

  const clearTimeRange = () => {
    resetField("startTime", { defaultValue: "" });
    resetField("endTime", { defaultValue: "" });
  };
  const startTimeField = register("startTime", {
    onChange: () => {
      resetField("endTime", { defaultValue: "" });
    },
  });
  const endTimeField = register("endTime");

  return {
    form: {
      handleSubmit,
      errors,
    },
    fields: {
      roomId: register("roomId", {
        onChange: clearTimeRange,
      }),
      date: register("date", {
        onChange: clearTimeRange,
      }),
      startTime: startTimeField,
      endTime: endTimeField,
      title: register("title"),
      organizer: register("organizer"),
      attendees: register("attendees"),
    },
    state: {
      roomId,
      date,
      startTime,
      selectedRoom,
    },
  };
}
