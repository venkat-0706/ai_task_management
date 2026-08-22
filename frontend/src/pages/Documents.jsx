import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Documents.css";

function Documents() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [results, setResults] = useState([]);

    const [search, setSearch] = useState("");

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUnauthorized = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/documents/");

            setDocuments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {
            console.error("FETCH DOCUMENTS ERROR:", err);
            console.error("STATUS:", err.response?.status);
            console.error("DATA:", err.response?.data);

            if (err.response?.status === 401) {
                handleUnauthorized();
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to load documents."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        setError("");
        setSuccess("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const allowedExtensions = [
            ".pdf",
            ".txt"
        ];

        const fileName = selectedFile.name.toLowerCase();

        const isValid = allowedExtensions.some(
            (extension) => fileName.endsWith(extension)
        );

        if (!isValid) {
            setFile(null);

            event.target.value = "";

            setError(
                "Only PDF and TXT files are supported."
            );

            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF or TXT document first.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append("file", file);

            const response = await api.post(
                "/documents/upload",
                formData
            );

            console.log(
                "UPLOAD RESPONSE:",
                response.data
            );

            setSuccess(
                response.data?.message ||
                "Document uploaded and processed successfully."
            );

            setFile(null);

            const input = document.getElementById(
                "document-file"
            );

            if (input) {
                input.value = "";
            }

            await fetchDocuments();

        } catch (err) {
            console.error("UPLOAD ERROR:", err);
            console.error(
                "UPLOAD STATUS:",
                err.response?.status
            );
            console.error(
                "UPLOAD DATA:",
                err.response?.data
            );

            if (err.response?.status === 401) {
                handleUnauthorized();
                return;
            }

            if (err.response?.status === 422) {
                const detail = err.response?.data?.detail;

                if (Array.isArray(detail)) {
                    setError(
                        detail
                            .map((item) => {
                                if (
                                    typeof item === "object"
                                ) {
                                    return (
                                        item.msg ||
                                        "Validation error"
                                    );
                                }

                                return String(item);
                            })
                            .join(", ")
                    );
                } else {
                    setError(
                        detail ||
                        "The uploaded file could not be validated."
                    );
                }

                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to upload document."
            );

        } finally {
            setUploading(false);
        }
    };

    const handleSearch = async () => {
        const query = search.trim();

        if (!query) {
            setResults([]);
            setError("");
            return;
        }

        try {
            setSearching(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/documents/search",
                {
                    query: query,
                    top_k: 10
                }
            );

            console.log(
                "SEARCH RESPONSE:",
                response.data
            );

            setResults(
                Array.isArray(response.data?.results)
                    ? response.data.results
                    : []
            );

        } catch (err) {
            console.error("SEARCH ERROR:", err);
            console.error(
                "SEARCH STATUS:",
                err.response?.status
            );
            console.error(
                "SEARCH DATA:",
                err.response?.data
            );

            if (err.response?.status === 401) {
                handleUnauthorized();
                return;
            }

            if (err.response?.status === 422) {
                const detail = err.response?.data?.detail;

                if (Array.isArray(detail)) {
                    setError(
                        detail
                            .map((item) => {
                                if (
                                    typeof item === "object"
                                ) {
                                    return (
                                        item.msg ||
                                        "Validation error"
                                    );
                                }

                                return String(item);
                            })
                            .join(", ")
                    );
                } else {
                    setError(
                        detail ||
                        "Invalid search request."
                    );
                }

                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to search documents."
            );

        } finally {
            setSearching(false);
        }
    };

    const clearSearch = () => {
        setSearch("");
        setResults([]);
        setError("");
        setSuccess("");
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "Unknown size";
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(2)} MB`;
    };

    const getFileExtension = (filename) => {
        if (!filename) {
            return "FILE";
        }

        const parts = filename.split(".");

        if (parts.length < 2) {
            return "FILE";
        }

        return parts.pop().toUpperCase();
    };

    return (
        <div className="documents-page">

            <header className="documents-header">

                <div className="documents-title-area">

                    <span className="documents-label">
                        DOCUMENT MANAGEMENT
                    </span>

                    <h1>
                        Documents
                    </h1>

                    <p>
                        Upload, search and manage your
                        documents using AI-powered tools.
                    </p>

                </div>

                <button
                    className="dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            {error && (
                <div className="error-message">
                    <span>
                        ⚠
                    </span>

                    <div>
                        <strong>
                            Something went wrong
                        </strong>

                        <p>
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {success && (
                <div className="success-message">
                    <span>
                        ✓
                    </span>

                    <div>
                        <strong>
                            Success
                        </strong>

                        <p>
                            {success}
                        </p>
                    </div>
                </div>
            )}

            <section className="document-section">

                <div className="section-heading">

                    <div className="section-icon upload-icon">
                        ↑
                    </div>

                    <div>
                        <h2>
                            Upload Document
                        </h2>

                        <p>
                            Upload a PDF or TXT file
                            to your workspace.
                        </p>
                    </div>

                </div>

                <div className="upload-box">

                    <div className="file-input-wrapper">

                        <input
                            id="document-file"
                            type="file"
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="document-file"
                            className="file-input-label"
                        >
                            <span className="file-upload-icon">
                                📄
                            </span>

                            <span>
                                {file
                                    ? file.name
                                    : "Choose a document"}
                            </span>

                            <small>
                                PDF or TXT
                            </small>
                        </label>

                    </div>

                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={
                            uploading ||
                            !file
                        }
                    >
                        {uploading ? (
                            <>
                                <span className="button-spinner"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                ↑ Upload Document
                            </>
                        )}
                    </button>

                </div>

                {file && (
                    <div className="selected-file">

                        <span>
                            📄
                        </span>

                        <div>
                            <strong>
                                {file.name}
                            </strong>

                            <small>
                                {formatFileSize(
                                    file.size
                                )}
                            </small>
                        </div>

                    </div>
                )}

            </section>

            <section className="document-section">

                <div className="section-heading">

                    <div className="section-icon search-icon">
                        🔍
                    </div>

                    <div>
                        <h2>
                            AI Document Search
                        </h2>

                        <p>
                            Search your uploaded documents
                            using semantic similarity.
                        </p>
                    </div>

                </div>

                <div className="search-container">

                    <div className="search-box">

                        <span className="search-symbol">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Ask something about your documents..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />

                        {search && (
                            <button
                                className="clear-search"
                                onClick={
                                    clearSearch
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <button
                        className="search-button"
                        onClick={handleSearch}
                        disabled={
                            searching ||
                            !search.trim()
                        }
                    >
                        {searching
                            ? "Searching..."
                            : "Search Documents"}
                    </button>

                </div>

            </section>

            <section className="results-section">

                <div className="results-header">

                    <div>
                        <span className="results-label">
                            {search
                                ? "AI SEARCH"
                                : "YOUR WORKSPACE"}
                        </span>

                        <h2>
                            {search
                                ? "Search Results"
                                : "Uploaded Documents"}
                        </h2>
                    </div>

                    <span className="results-count">
                        {search
                            ? `${results.length} results`
                            : `${documents.length} documents`}
                    </span>

                </div>

                {loading && (
                    <div className="state-message">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading documents...
                        </p>

                    </div>
                )}

                {!loading &&
                    !search &&
                    documents.length === 0 && (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📁
                            </div>

                            <h3>
                                No documents uploaded
                            </h3>

                            <p>
                                Upload your first PDF or
                                TXT document to get started.
                            </p>

                        </div>
                    )}

                {!loading &&
                    !search &&
                    documents.length > 0 && (

                        <div className="documents-list">

                            {documents.map(
                                (document, index) => {

                                    const filename =
                                        document.filename ||
                                        document.name ||
                                        `Document ${index + 1}`;

                                    return (
                                        <div
                                            className="document-card"
                                            key={
                                                document.id ||
                                                `${filename}-${index}`
                                            }
                                        >

                                            <div className="document-icon">
                                                📄
                                            </div>

                                            <div className="document-info">

                                                <h3>
                                                    {filename}
                                                </h3>

                                                <div className="document-meta">

                                                    <span>
                                                        {getFileExtension(
                                                            filename
                                                        )}
                                                    </span>

                                                    {document.size && (
                                                        <span>
                                                            {formatFileSize(
                                                                document.size
                                                            )}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                            <div className="document-status">
                                                ✓
                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                {searching && (
                    <div className="state-message">

                        <div className="loading-spinner"></div>

                        <p>
                            Searching your documents...
                        </p>

                    </div>
                )}

                {!searching &&
                    search &&
                    results.length === 0 && (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🔍
                            </div>

                            <h3>
                                No matching documents found
                            </h3>

                            <p>
                                Try different keywords or
                                ask your question another way.
                            </p>

                        </div>
                    )}

                {!searching &&
                    search &&
                    results.length > 0 && (

                        <div className="documents-list">

                            {results.map(
                                (result, index) => {

                                    const filename =
                                        result.filename ||
                                        result.name ||
                                        result.document ||
                                        `Search Result ${index + 1}`;

                                    return (
                                        <div
                                            className="document-card search-result-card"
                                            key={index}
                                        >

                                            <div className="document-icon search-result-icon">
                                                🔎
                                            </div>

                                            <div className="document-info">

                                                <h3>
                                                    {filename}
                                                </h3>

                                                {result.score !==
                                                    undefined && (
                                                    <div className="similarity">
                                                        Similarity:
                                                        {" "}
                                                        {(
                                                            result.score *
                                                            100
                                                        ).toFixed(2)}
                                                        %
                                                    </div>
                                                )}

                                                {result.text && (
                                                    <p className="result-text">
                                                        {
                                                            result.text
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

            </section>

        </div>
    );
}

export default Documents;