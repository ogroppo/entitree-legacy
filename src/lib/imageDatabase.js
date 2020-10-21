const imageDbServer = "https://images.dataprick.com";

export default function missingImagesLink(id, label) {
  const params = new URLSearchParams({
    qId: id,
    qLabel: label,
  });

  return imageDbServer + "/image/single_upload?" + params.toString();
}
