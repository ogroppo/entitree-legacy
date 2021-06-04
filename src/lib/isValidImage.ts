export const isValidImage = (url: string): Promise<boolean> =>
  new Promise((resolve) => {
    let img = new Image();
    img.onload = () => {
      resolve(true);
    };
    img.onerror = (error) => {
      resolve(false);
    };
    img.src = url;
  });
