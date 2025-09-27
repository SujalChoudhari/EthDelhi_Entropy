export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found!", { status: 404 });
  }

  try {
    const reservations = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('reservations') || '[]') 
      : [];
    const reservation = reservations.find((r: any) => r.id === id);

    if (!reservation) {
      return new Response("Reservation not found!", { status: 404 });
    }

    return Response.json(reservation);
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found!", { status: 404 });
  }

  try {
    const reservations = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('reservations') || '[]') 
      : [];
    const index = reservations.findIndex((r: any) => r.id === id);
    
    if (index === -1) {
      return new Response("Reservation not found!", { status: 404 });
    }

    const reservation = reservations[index];
    
    if (reservation.hasCompletedPayment) {
      return new Response("Reservation is already paid!", { status: 409 });
    }

    const { magicWord } = await request.json();

    if (magicWord.toLowerCase() !== "vercel") {
      return new Response("Invalid magic word!", { status: 400 });
    }

    reservations[index] = {
      ...reservation,
      hasCompletedPayment: true
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('reservations', JSON.stringify(reservations));
    }
    
    return Response.json(reservations[index]);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
