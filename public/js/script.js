// Jai Shree Ram

function threejs() {
  // Create scene, camera and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(".canvas"),
    antialias: true,
    alpha: true, // Enable transparency
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // Prevent scrollbar issues

  // Add ambient and directional light
  const ambientLight = new THREE.AmbientLight("#fff", 1); // Increased intensity
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("#fff", 1); // Increased intensity
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Load HDRI environment map
  const rgbeLoader = new THREE.RGBELoader();
  rgbeLoader.load(
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/the_sky_is_on_fire_1k.hdr",
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = null; // Keep background transparent
      //threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr
      // Set texture encoding to match renderer
      https: texture.encoding = THREE.sRGBEncoding;
    }
  );

  // Load 3D model
  const loader = new THREE.GLTFLoader();
  let model;

  loader.load(
    "../img/letter-box.glb",
    function (gltf) {
      model = gltf.scene;
      // Center the model precisely
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      // Adjust model position to be exactly at center
      model.position.set(0, -2, 0);

      // Increase scale for closer zoom
      model.scale.set(3, 3, 3); // Increased from 2.5 to 4 for more zoom

      // Update material encoding for all meshes
      model.traverse((node) => {
        if (node.isMesh) {
          node.material.encoding = THREE.sRGBEncoding;
          node.material.metalness = 0.8;
          node.material.roughness = 0.2;
        }
      });
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error("An error occurred loading the model:", error);
    }
  );

  // Set camera position
  camera.position.z = 3.5; // Reduced from 5 to 3.5 for closer view

  // Add mouse movement effect
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  document.addEventListener("mousemove", (event) => {
    // Reduced movement sensitivity by increasing divisor
    mouseX = (event.clientX - window.innerWidth / 2) / 500;
    mouseY = (event.clientY - window.innerHeight / 2) / 1000; // Reduced Y-axis sensitivity
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      // Further reduced Y-axis rotation
      targetRotationX += (mouseY - targetRotationX) * 0.01; // Reduced Y rotation speed
      targetRotationY += (mouseX - targetRotationY) * 0.02;

      // Reduced maximum Y rotation amount
      model.rotation.x = targetRotationX * 0.15; // Halved Y-axis rotation
      model.rotation.y = targetRotationY * 0.3;
    }

    renderer.render(scene, camera);
  }

  animate();
}

function lenis() {
  // Initialize Lenis
  const lenis = new Lenis();

  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function openCamera() {
  // Trigger the camera input when camera button is clicked
  document.querySelector("input[name=cameraPhoto]").click();
}

function submitForm() {
  // Handle form submission
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch("/complaint", {
        method: "POST",
        body: formData, // FormData handles multipart/form-data for file uploads
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Complaint submitted successfully!\nPlease take a note of your complaint ID for future reference. ('${data.complaintId}') \n Don't worry it is copied to your clipboard.`
        );
        navigator.clipboard.writeText(data.complaintId).catch((err) => {
          console.warn("Failed to copy complaint ID to clipboard:", err);
        });
        e.target.reset(); // Reset form on success
      } else {
        throw new Error(data.error || "Failed to submit complaint");
      }
    } catch (error) {
      alert(error.message);
      console.error("Error:", error);
    }
  });
}

lenis();
