

export const convertDateToString = (value: Date | string) => {
  if (value instanceof Date) {
    return value.toISOString();
  } else if (typeof value === 'string') {
    return value;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertFormDatesToString = (data: any) => {
  const convertedData = { ...data };

  // All the date fields that need to be converted
  const dateFields = [
    'departureDate',
    'arrivalDate',
    'checkInDate',
    'checkInTime',
    'checkOutDate',
    'checkOutTime',
    'departureTime',
    'arrivalTime',
    'dropOffDate',
    'dropOffTime',
    'reservationDate',
    'reservationTime',
    'startDate',
    'startTime',
    'endDate',
    'endTime'
  ];

  // Loop over the date fields and apply the conversion
  dateFields.forEach((field) => {
    if (convertedData[field]) {
      convertedData[field] = convertDateToString(convertedData[field]);
    }
  });

  return convertedData;
};
