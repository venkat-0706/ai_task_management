import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../services/api";

import "./Documents.css";


function Documents() {

    const navigate = useNavigate();

    const [file, setFile] =
        useState(null);

    const [documents, setDocuments] =
        useState([]);

    const [results, setResults] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [searching, setSearching] =
        useState(false);

    const [
        viewingFile,
        setViewingFile
    ] = useState(null);

    const [
        downloadingFile,
        setDownloadingFile
    ] = useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // FETCH DOCUMENTS
    // ==========================================

    const fetchDocuments = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/documents/"
                );

            console.log(
                "DOCUMENTS API RESPONSE:",
                response.data
            );

            setDocuments(
                Array.isArray(
                    response.data?.documents
                )
                    ? response.data.documents
                    : []
            );

        } catch (err) {

            console.error(
                "DOCUMENT FETCH ERROR:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to load documents."
            );

            setDocuments([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD DOCUMENTS ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        fetchDocuments();

    }, []);


    // ==========================================
    // FILE CHANGE
    // ==========================================

    const handleFileChange =
        (event) => {

            const selectedFile =
                event.target.files?.[0];

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

            const filename =
                selectedFile.name
                    .toLowerCase();

            const validFile =
                allowedExtensions.some(
                    (extension) =>
                        filename.endsWith(
                            extension
                        )
                );

            if (!validFile) {

                setFile(null);

                event.target.value = "";

                setError(
                    "Only PDF and TXT files are supported."
                );

                return;

            }

            setFile(
                selectedFile
            );

        };


    // ==========================================
    // UPLOAD DOCUMENT
    // ==========================================

    const handleUpload =
        async () => {

            if (!file) {

                setError(
                    "Please select a document first."
                );

                return;

            }

            try {

                setUploading(true);

                setError("");

                setSuccess("");

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                const response =
                    await api.post(
                        "/documents/upload",
                        formData
                    );

                console.log(
                    "UPLOAD RESPONSE:",
                    response.data
                );

                setSuccess(
                    response.data?.message ||
                    "Document uploaded successfully."
                );

                setFile(null);

                const input =
                    document.getElementById(
                        "document-file"
                    );

                if (input) {

                    input.value = "";

                }

                // Refresh documents
                await fetchDocuments();

            } catch (err) {

                console.error(
                    "UPLOAD ERROR:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to upload document."
                );

            } finally {

                setUploading(false);

            }

        };


    // ==========================================
    // VIEW DOCUMENT
    // Backend expects DOCUMENT ID
    // ==========================================

    const handleViewDocument =
        async (documentItem) => {

            try {

                setViewingFile(
                    documentItem.id
                );

                setError("");

                const response =
                    await api.get(
                        `/documents/view/${documentItem.id}`,
                        {
                            responseType:
                                "blob"
                        }
                    );

                const fileURL =
                    URL.createObjectURL(
                        response.data
                    );

                window.open(
                    fileURL,
                    "_blank"
                );

                setTimeout(() => {

                    URL.revokeObjectURL(
                        fileURL
                    );

                }, 60000);

            } catch (err) {

                console.error(
                    "VIEW ERROR:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to open document."
                );

            } finally {

                setViewingFile(null);

            }

        };


    // ==========================================
    // DOWNLOAD DOCUMENT
    // Backend expects DOCUMENT ID
    // ==========================================

    const handleDownloadDocument =
        async (documentItem) => {

            try {

                setDownloadingFile(
                    documentItem.id
                );

                setError("");

                const response =
                    await api.get(
                        `/documents/download/${documentItem.id}`,
                        {
                            responseType:
                                "blob"
                        }
                    );

                const fileURL =
                    URL.createObjectURL(
                        response.data
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    fileURL;

                link.download =
                    documentItem.original_filename ||
                    documentItem.filename;

                document.body.appendChild(
                    link
                );

                link.click();

                document.body.removeChild(
                    link
                );

                URL.revokeObjectURL(
                    fileURL
                );

                setSuccess(
                    `${documentItem.original_filename} downloaded successfully.`
                );

            } catch (err) {

                console.error(
                    "DOWNLOAD ERROR:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to download document."
                );

            } finally {

                setDownloadingFile(null);

            }

        };


    // ==========================================
    // SEARCH DOCUMENTS
    // ==========================================

    const handleSearch =
        async () => {

            const query =
                search.trim();

            if (!query) {

                setResults([]);

                return;

            }

            try {

                setSearching(true);

                setError("");

                setSuccess("");

                const response =
                    await api.post(
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
                    Array.isArray(
                        response.data?.results
                    )
                        ? response.data.results
                        : []
                );

            } catch (err) {

                console.error(
                    "SEARCH ERROR:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to search documents."
                );

                setResults([]);

            } finally {

                setSearching(false);

            }

        };


    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    const clearSearch = () => {

        setSearch("");

        setResults([]);

        setError("");

    };


    // ==========================================
    // ENTER KEY SEARCH
    // ==========================================

    const handleSearchKeyDown =
        (event) => {

            if (
                event.key === "Enter"
            ) {

                handleSearch();

            }

        };


    // ==========================================
    // FORMAT FILE SIZE
    // ==========================================

    const formatFileSize =
        (bytes) => {

            if (
                !bytes &&
                bytes !== 0
            ) {

                return "Unknown size";

            }

            if (bytes < 1024) {

                return `${bytes} B`;

            }

            if (
                bytes <
                1024 * 1024
            ) {

                return `${(
                    bytes / 1024
                ).toFixed(2)} KB`;

            }

            return `${(
                bytes /
                (1024 * 1024)
            ).toFixed(2)} MB`;

        };


    // ==========================================
    // GET FILE EXTENSION
    // ==========================================

    const getFileExtension =
        (filename) => {

            if (!filename) {

                return "FILE";

            }

            const parts =
                filename.split(".");

            if (
                parts.length < 2
            ) {

                return "FILE";

            }

            return parts
                .pop()
                .toUpperCase();

        };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate =
        (dateString) => {

            if (!dateString) {

                return "";

            }

            try {

                return new Date(
                    dateString
                ).toLocaleString();

            } catch {

                return "";

            }

        };


    return (

        <div className="documents-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <header className="documents-header">

                <div>

                    <span className="documents-label">
                        KNOWLEDGE MANAGEMENT
                    </span>

                    <h1>
                        Documents
                    </h1>

                    <p>
                        Access, search, view and download
                        shared knowledge documents.
                    </p>

                </div>


                <button
                    className="dashboard-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* ======================================
                ERROR MESSAGE
            ====================================== */}

            {error && (

                <div className="error-message">
                    ⚠ {error}
                </div>

            )}


            {/* ======================================
                SUCCESS MESSAGE
            ====================================== */}

            {success && (

                <div className="success-message">
                    ✓ {success}
                </div>

            )}


            {/* ======================================
                UPLOAD SECTION
            ====================================== */}

            <section className="document-section">

                <div className="section-heading">

                    <div className="section-icon">
                        ↑
                    </div>

                    <div>

                        <h2>
                            Upload Document
                        </h2>

                        <p>
                            Upload PDF or TXT documents.
                        </p>

                    </div>

                </div>


                <div className="upload-box">

                    <input
                        id="document-file"
                        type="file"
                        accept=".pdf,.txt"
                        onChange={
                            handleFileChange
                        }
                    />


                    <button
                        className="upload-button"
                        onClick={
                            handleUpload
                        }
                        disabled={
                            uploading ||
                            !file
                        }
                    >

                        {uploading
                            ? "Uploading..."
                            : "↑ Upload"}

                    </button>

                </div>


                {file && (

                    <div className="selected-file">

                        <strong>
                            {file.name}
                        </strong>

                        <span>
                            {formatFileSize(
                                file.size
                            )}
                        </span>

                    </div>

                )}

            </section>


            {/* ======================================
                AI SEARCH SECTION
            ====================================== */}

            <section className="document-section">

                <div className="section-heading">

                    <div className="section-icon">
                        🔍
                    </div>

                    <div>

                        <h2>
                            AI Document Search
                        </h2>

                        <p>
                            Ask questions and find relevant
                            information from documents.
                        </p>

                    </div>

                </div>


                <div className="search-container">

                    <div className="search-box">

                        <span>
                            🔍
                        </span>


                        <input
                            type="text"
                            placeholder="Search your documents..."
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
                        onClick={
                            handleSearch
                        }
                        disabled={
                            searching ||
                            !search.trim()
                        }
                    >

                        {searching
                            ? "Searching..."
                            : "Search"}

                    </button>

                </div>

            </section>


            {/* ======================================
                DOCUMENT LIBRARY
            ====================================== */}

            <section className="results-section">

                <div className="results-header">

                    <div>

                        <span className="results-label">
                            DOCUMENT LIBRARY
                        </span>

                        <h2>
                            Available Documents
                        </h2>

                    </div>


                    <span className="results-count">

                        {documents.length} documents

                    </span>

                </div>


                {loading && (

                    <div className="state-message">
                        Loading documents...
                    </div>

                )}


                {!loading &&
                    documents.length === 0 && (

                        <div className="empty-state">

                            <h3>
                                No documents available
                            </h3>

                            <p>
                                Upload a document to get
                                started.
                            </p>

                        </div>

                    )}


                {!loading &&
                    documents.length > 0 && (

                        <div className="documents-list">

                            {documents.map(
                                (
                                    documentItem,
                                    index
                                ) => {

                                    const displayFilename =
                                        documentItem.original_filename ||
                                        documentItem.filename ||
                                        `Document ${index + 1}`;

                                    return (

                                        <div
                                            className="document-card"
                                            key={documentItem.id}
                                        >

                                            <div className="document-icon">
                                                📄
                                            </div>


                                            <div className="document-info">

                                                <h3>
                                                    {displayFilename}
                                                </h3>


                                                <div className="document-meta">

                                                    <span>

                                                        {getFileExtension(
                                                            displayFilename
                                                        )}

                                                    </span>


                                                    <span>

                                                        {formatFileSize(
                                                            documentItem.file_size
                                                        )}

                                                    </span>


                                                    {documentItem.created_at && (

                                                        <span>

                                                            {formatDate(
                                                                documentItem.created_at
                                                            )}

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            <div className="document-actions">


                                                {/* VIEW */}

                                                <button
                                                    className="view-button"
                                                    disabled={
                                                        viewingFile ===
                                                        documentItem.id
                                                    }
                                                    onClick={() =>
                                                        handleViewDocument(
                                                            documentItem
                                                        )
                                                    }
                                                >

                                                    {viewingFile ===
                                                    documentItem.id
                                                        ? "Opening..."
                                                        : "👁 View"}

                                                </button>


                                                {/* DOWNLOAD */}

                                                <button
                                                    className="download-button"
                                                    disabled={
                                                        downloadingFile ===
                                                        documentItem.id
                                                    }
                                                    onClick={() =>
                                                        handleDownloadDocument(
                                                            documentItem
                                                        )
                                                    }
                                                >

                                                    {downloadingFile ===
                                                    documentItem.id
                                                        ? "Downloading..."
                                                        : "↓ Download"}

                                                </button>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

            </section>


            {/* ======================================
                AI SEARCH RESULTS
            ====================================== */}

            {search && (

                <section className="results-section">

                    <div className="results-header">

                        <div>

                            <span className="results-label">
                                AI SEARCH RESULTS
                            </span>

                            <h2>
                                Search Results
                            </h2>

                        </div>


                        <span className="results-count">

                            {results.length} results

                        </span>

                    </div>


                    {searching && (

                        <div className="state-message">
                            Searching documents...
                        </div>

                    )}


                    {!searching &&
                        search.trim() &&
                        results.length === 0 && (

                            <div className="empty-state">

                                <h3>
                                    No results found
                                </h3>

                                <p>
                                    Try another search query.
                                </p>

                            </div>

                        )}


                    {!searching &&
                        results.length > 0 && (

                            <div className="search-results-list">

                                {results.map(
                                    (
                                        result,
                                        index
                                    ) => (

                                        <div
                                            className="search-result-card"
                                            key={index}
                                        >

                                            <div className="document-icon">
                                                🔎
                                            </div>


                                            <div className="document-info">

                                                <h3>

                                                    {result.filename ||
                                                        result.metadata?.filename ||
                                                        `Result ${index + 1}`}

                                                </h3>


                                                {result.score !==
                                                    undefined && (

                                                    <p className="similarity">

                                                        Match:{" "}

                                                        {(
                                                            result.score *
                                                            100
                                                        ).toFixed(1)}

                                                        %

                                                    </p>

                                                )}


                                                {result.content && (

                                                    <p className="result-content">

                                                        {result.content}

                                                    </p>

                                                )}


                                                {result.text && (

                                                    <p className="result-content">

                                                        {result.text}

                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </section>

            )}

        </div>

    );

}


export default Documents;