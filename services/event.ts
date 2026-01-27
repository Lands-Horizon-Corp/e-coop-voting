import db from "@/lib/database";

export const getEventId = async (id: number) => {
    try {
        const eventId = Number(id);
        const event = await db.event.findUnique({
            where: { id: eventId },
        });
        return event?.id;
    } catch (error) {
        console.log(error);
    }
};
