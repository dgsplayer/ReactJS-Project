import L from "leaflet";
import CustomMarkerType from "../interfaces/types/CustomMarkerType";

const createCustomMarker = (markerType: CustomMarkerType, index?: number) => {
  // Span that holds all the imgs and elements for the marker
  const spanElement = document.createElement("span");
  spanElement.classList.add("customMarker");

  // Creating the franchise marker (the green one with
  // a house icon inside)
  if (markerType === "franchise") {
    const imgElement = document.createElement("img");
    imgElement.setAttribute("alt", "Custom Icon Marker");
    imgElement.setAttribute("src", "/marker-icon-green.png");

    const svgImg = document.createElement("img");
    svgImg.setAttribute("alt", "Custom Marker SVG");
    svgImg.setAttribute("src", "/home.svg");
    svgImg.classList.add("svgImg");

    spanElement.appendChild(imgElement);
    spanElement.appendChild(svgImg);

    return L.divIcon({
      html: spanElement,
      popupAnchor: [0, -25],
    });
  }

  // The blue (standard marker), green (first delivery),
  // purple (last delivery) and orange (clicked marker)
  // markers contain the position of the delivery inside
  if (index !== undefined) {
    const indexPElement = document.createElement("p");
    indexPElement.innerHTML = `${index + 1}`;
    spanElement.appendChild(indexPElement);
  }

  const imgElement = document.createElement("img");
  imgElement.setAttribute("alt", "Custom Icon Marker");
  imgElement.setAttribute("src", `/marker-icon-${markerType}.png`);

  spanElement.appendChild(imgElement);

  return L.divIcon({
    html: spanElement,
    popupAnchor: [0, -25],
  });
};

export default createCustomMarker;
