interface PointLatLng {
  lat: number;
  lng: number;
}

const calculateDistanceBetweenTwoPoints = (
  pointA: PointLatLng,
  pointB: PointLatLng,
  unit: "M" | "K" | "N"
) => {
  if (pointA.lat === pointB.lat && pointA.lng === pointB.lng) {
    return 0;
  }

  let radlat1 = (Math.PI * pointA.lat) / 180;
  let radlat2 = (Math.PI * pointB.lat) / 180;

  let theta = pointA.lng - pointB.lng;

  let radtheta = (Math.PI * theta) / 180;

  let distance =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (distance > 1) {
    distance = 1;
  }

  distance = Math.acos(distance);
  distance = (distance * 180) / Math.PI;
  distance = distance * 60 * 1.1515;

  if (unit === "K") {
    distance = distance * 1.609344;
  }

  if (unit === "N") {
    distance = distance * 0.8684;
  }

  return distance;
};

export default calculateDistanceBetweenTwoPoints;
