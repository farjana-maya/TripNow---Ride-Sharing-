import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  FileText,
  Calendar,
  MapPin,
  Hash,
  Palette,
  CheckCircle,
  AlertCircle,
  Navigation,
  ArrowRight,
  Shield,
  User,
  Upload,
} from "lucide-react";
import { driverService } from "../services/driverService";

const DriverForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    license_number: "",
    license_expiry: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_number: "",
    vehicle_color: "",
    vehicle_year: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    nid_number: "",
    nid_copy: null,
    license_paper: null,
    vehicle_documents: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "driver") {
      alert("Only drivers can access this page");
      navigate("/");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "vehicle_documents") {
        setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.license_number.trim()) {
      newErrors.license_number = "License number is required";
    }

    if (!formData.license_expiry) {
      newErrors.license_expiry = "License expiry date is required";
    } else if (new Date(formData.license_expiry) <= new Date()) {
      newErrors.license_expiry = "License must not be expired";
    }

    if (!formData.vehicle_type) {
      newErrors.vehicle_type = "Vehicle type is required";
    }

    if (!formData.vehicle_model.trim()) {
      newErrors.vehicle_model = "Vehicle model is required";
    }

    if (!formData.vehicle_number.trim()) {
      newErrors.vehicle_number = "Vehicle number is required";
    }

    if (!formData.vehicle_color.trim()) {
      newErrors.vehicle_color = "Vehicle color is required";
    }

    if (!formData.vehicle_year) {
      newErrors.vehicle_year = "Vehicle year is required";
    } else if (
      formData.vehicle_year < 2010 ||
      formData.vehicle_year > currentYear + 1
    ) {
      newErrors.vehicle_year = `Vehicle year must be between 2010 and ${
        currentYear + 1
      }`;
    }

    if (!formData.nid_number.trim()) {
      newErrors.nid_number = "NID number is required";
    }

    if (!formData.nid_copy) {
      newErrors.nid_copy = "NID copy is required";
    }

    if (!formData.license_paper) {
      newErrors.license_paper = "License paper is required";
    }

    if (formData.vehicle_documents.length === 0) {
      newErrors.vehicle_documents = "At least one vehicle document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await driverService.submitDriverInfo(formData);

      if (response.success) {
        alert(
          "Driver information submitted successfully! You will be notified once your account is verified (typically within 24-48 hours)."
        );
        navigate("/driver/pending");
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          alert(response.message || "Submission failed");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit driver information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: "standard", label: "Standard", icon: "🚗" },
    { value: "premium", label: "Premium", icon: "✨" },
    { value: "suv", label: "SUV", icon: "🚙" },
    { value: "bike", label: "Bike", icon: "🏍️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 py-12 px-6">
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center space-x-3 mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl shadow-lg"></div>
              <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                <Navigation
                  className="text-emerald-500 transform rotate-45"
                  size={24}
                />
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              TripNow
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Driver Profile
          </h2>
          <p className="text-gray-600">
            Fill in your vehicle and license information to get verified
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Account Created</p>
                <p className="text-xs text-gray-500">Step 1 of 3</p>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-4"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <p className="font-bold text-gray-900">Driver Information</p>
                <p className="text-xs text-gray-500">Current Step</p>
              </div>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold">
                3
              </div>
              <div>
                <p className="font-bold text-gray-400">Verification</p>
                <p className="text-xs text-gray-400">Final Step</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* License Information */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  License Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                        errors.license_number
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                      placeholder="DL-1420110012345"
                    />
                  </div>
                  {errors.license_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.license_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black-700 mb-2">
                    License Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      name="license_expiry"
                      value={formData.license_expiry}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                        errors.license_expiry
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                    />
                  </div>
                  {errors.license_expiry && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.license_expiry}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <Car className="text-emerald-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Vehicle Information
                </h3>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {vehicleTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          vehicle_type: type.value,
                        }))
                      }
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        formData.vehicle_type === type.value
                          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <div className="text-sm font-bold text-gray-900">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.vehicle_type && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.vehicle_type}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                      errors.vehicle_model
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                    placeholder="Toyota Corolla"
                  />
                  {errors.vehicle_model && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicle_model}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                      errors.vehicle_number
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                    placeholder="DHA-12-3456"
                  />
                  {errors.vehicle_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicle_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Color <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Palette
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="vehicle_color"
                      value={formData.vehicle_color}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                        errors.vehicle_color
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                      }`}
                      placeholder="White"
                    />
                  </div>
                  {errors.vehicle_color && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicle_color}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    min="2010"
                    max={new Date().getFullYear() + 1}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                      errors.vehicle_year
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                    placeholder="2020"
                  />
                  {errors.vehicle_year && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicle_year}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Uploads Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <Upload className="text-orange-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Document Uploads
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NID Copy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="nid_copy"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 ${
                      errors.nid_copy
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload scan/photo of NID (Max 5MB)
                  </p>
                  {formData.nid_copy && (
                    <p className="mt-1 text-xs text-emerald-600 flex items-center space-x-1">
                      <CheckCircle size={12} />
                      <span>File selected: {formData.nid_copy.name}</span>
                    </p>
                  )}
                  {errors.nid_copy && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nid_copy}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Paper <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="license_paper"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                      errors.license_paper
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload scan/photo of driving license (Max 5MB)
                  </p>
                  {formData.license_paper && (
                    <p className="mt-1 text-xs text-emerald-600 flex items-center space-x-1">
                      <CheckCircle size={12} />
                      <span>File selected: {formData.license_paper.name}</span>
                    </p>
                  )}
                  {errors.license_paper && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.license_paper}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Documents <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="vehicle_documents"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 ${
                      errors.vehicle_documents
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload vehicle registration, insurance, etc. (Multiple files
                    allowed, Max 5MB each)
                  </p>
                  {formData.vehicle_documents &&
                    formData.vehicle_documents.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Array.from(formData.vehicle_documents).map(
                          (file, index) => (
                            <p
                              key={index}
                              className="text-xs text-emerald-600 flex items-center space-x-1"
                            >
                              <CheckCircle size={12} />
                              <span>
                                File {index + 1}: {file.name}
                              </span>
                            </p>
                          )
                        )}
                      </div>
                    )}
                  {errors.vehicle_documents && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.vehicle_documents}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* NID Information */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <User className="text-purple-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Identity Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NID/Passport Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="nid_number"
                    value={formData.nid_number}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-black ${
                      errors.nid_number
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                    placeholder="1234567890123"
                  />
                </div>
                {errors.nid_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nid_number}
                  </p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <MapPin className="text-orange-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Address Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Optional - but recommended
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-black"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-black"
                    placeholder="Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State/Division
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-black"
                    placeholder="Dhaka Division"
                  />
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield
                  className="text-blue-600 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    What happens next?
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle
                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                        size={16}
                      />
                      <span>
                        Our team will review your information within 24-48 hours
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle
                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                        size={16}
                      />
                      <span>
                        You'll receive an email and SMS notification once
                        approved
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle
                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                        size={16}
                      />
                      <span>
                        After approval, you can start accepting rides
                        immediately
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for Verification</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverForm;
