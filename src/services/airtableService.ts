const AIRTABLE_API_KEY = 'patCfcL8VMRGW3HqG.0e31372ac83a197127f9265a37d8ee4c9c333f92190635a4b91f45aeea0fe3b1';
const AIRTABLE_BASE_ID = 'appg6HbcotysgN5Rz';

interface AirtableRecord {
  id: string;
  fields: {
    trackingNumber?: string;
    waybillNumber?: string;
    status?: string;
    currentLocation?: string;
    estimatedDelivery?: string;
    shipmentType?: string;
    [key: string]: any;
  };
  createdTime: string;
}

interface ShipmentData {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery?: string;
  shipmentType: string;
  [key: string]: any;
}

export const fetchShipmentFromAirtable = async (
  trackingNumber: string,
  shipmentType: 'normal' | 'waybill'
): Promise<ShipmentData | null> => {
  try {
    const tableName = shipmentType === 'waybill' ? 'Waybill Shipments' : 'Normal Shipments';
    const trackingField = shipmentType === 'waybill' ? 'waybillNumber' : 'trackingNumber';

    const filterFormula = `{${trackingField}}='${trackingNumber}'`;
    const timestamp = Date.now();
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}?filterByFormula=${encodeURIComponent(filterFormula)}&_t=${timestamp}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Airtable API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const record: AirtableRecord = data.records[0];
      const rawStatus = record.fields.status || 'Processing';
      const normalizedStatus = normalizeStatus(rawStatus);

      return {
        trackingNumber: record.fields[trackingField] || trackingNumber,
        status: normalizedStatus,
        currentLocation: record.fields.currentLocation || 'Unknown',
        estimatedDelivery: record.fields.estimatedDelivery,
        shipmentType: shipmentType,
        ...record.fields,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    return null;
  }
};

export const refreshShipmentStatus = async (
  trackingNumber: string,
  shipmentType: 'normal' | 'waybill'
): Promise<{ status: string; currentLocation: string } | null> => {
  try {
    const shipmentData = await fetchShipmentFromAirtable(trackingNumber, shipmentType);

    if (shipmentData) {
      return {
        status: shipmentData.status,
        currentLocation: shipmentData.currentLocation,
      };
    }

    return null;
  } catch (error) {
    console.error('Error refreshing shipment status:', error);
    return null;
  }
};

const normalizeStatus = (status: string): string => {
  const lowerStatus = status.toLowerCase().trim();

  if (lowerStatus === 'processing') {
    return 'Processing';
  } else if (lowerStatus === 'in-transit' || lowerStatus === 'in transit' || lowerStatus === 'intransit') {
    return 'In Transit';
  } else if (lowerStatus === 'delivered') {
    return 'Delivered';
  }

  return 'Processing';
};

export const getStatusOptions = () => {
  return ['Processing', 'In Transit', 'Delivered'];
};
