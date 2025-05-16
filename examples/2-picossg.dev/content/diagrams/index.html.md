---
layout: _base.njk
title: Diagrams
---

# PicoSSG Processing Flow

This diagram shows how PicoSSG processes files from source to output, including the handling of different file types and processing steps.

<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true });
    await mermaid.run({
        querySelector: '.language-mermaid',
    });
</script>

```mermaid
flowchart TD
    %% Phase 1: File Collection and Filtering
    start([Start Build Process]) --> scanDir[Scan Content Directory]
    scanDir --> fileList[["All Content Files"]]

    %% Phase 2: File Filtering (done for all files first)
    fileList --> fileFiltering[Filter Files]
    fileFiltering --> skipFiles["Files starting with _\n(Used as includes/layouts)"]
    fileFiltering --> plainFiles["Plain Files\n(No processor extensions)"]
    fileFiltering --> processableFiles["Processable Files\n(.md, .njk, combined)"]

    %% Phase 3: Metadata Collection (for all processable files)
    processableFiles --> readAllFiles["Read All Processable Files"]
    readAllFiles --> extractAllMeta["Extract Front Matter\nfrom All Files"]
    extractAllMeta --> allMetadata[["All Files Metadata\nCollection"]]

    %% Phase 4: Preprocessing (optional, runs on all files)
    allMetadata --> preprocessCheck{"_config.js has\npreprocess() function?"}
    preprocessCheck -->|Yes| runPreprocess["Run preprocess()\non All Files"]
    preprocessCheck -->|No| contentProcessing
    runPreprocess --> contentProcessing

    %% Phase 5: Content Processing (per file but all files go through this)
    contentProcessing([Content Processing Phase]) --> processEachFile["Process Each File by Type"]

    subgraph "For Each File"
        processEachFile --> initContent["Initialize Content\nwith Original File"]
        initContent --> extensionLoop["Start Processing Extensions"]

        %% Extension processing loop
        extensionLoop --> hasExtension{"More extensions\nto process?"}
        hasExtension -->|No| layoutCheck
        hasExtension -->|Yes| getLastExt["Get Rightmost Extension"]

        getLastExt --> extType{"Extension Type?"}
        extType -->|.njk| njkProcess["Process with\nNunjucks Engine"]
        extType -->|.md| mdProcess["Process with\nmarkdown-it"]
        extType -->|other| otherProcess["Process with\nappropriate processor"]

        njkProcess & mdProcess & otherProcess --> removeExt["Remove processed extension\nand continue with result"]
        removeExt --> hasExtension

        %% Layout application after all extensions processed
        layoutCheck{"Has layout in\nfront matter?"} -->|Yes| applyLayout["Apply Layout Template"]
        layoutCheck -->|No| fileProcessed
        applyLayout --> fileProcessed["File Content Processed"]
    end

    %% Phase 6: Post-processing (optional, runs on all processed files)
    fileProcessed --> allFilesProcessed[["All Files Processed"]]
    allFilesProcessed --> postprocessCheck{"_config.js has\npostprocess() function?"}
    postprocessCheck -->|Yes| runPostprocess["Run postprocess()\non All Files"]
    postprocessCheck -->|No| outputPhase
    runPostprocess --> outputPhase

    %% Phase 7: Output Phase
    outputPhase([Output Phase]) --> writePlainFiles["Copy Plain Files As-Is"]
    outputPhase --> writeProcessedFiles["Write All Processed Files"]

    %% Final phase
    writePlainFiles & writeProcessedFiles --> done([Build Complete])
    skipFiles --> done
```

## Understanding the Flow

PicoSSG processes all files in distinct phases, where each phase operates on the entire collection of files:

1. **File Collection and Filtering**
   - All files in the content directory are scanned
   - Files starting with underscore (`_`) are identified for use as includes/layouts
   - Files are categorized as either plain files or processable files

2. **Metadata Collection**
   - All processable files are read in one pass
   - Front matter (YAML between `---` markers) is extracted from each file
   - A complete metadata collection is built for the entire site

3. **Preprocessing (Optional)**
   - If `_config.js` provides a `preprocess()` function:
     - It runs on all files at once
     - Has access to the complete metadata collection
     - Can modify file content and metadata before processing

4. **Content Processing**
   - Each file is processed in a loop that handles extensions one at a time:
     - Processing starts with the original file content
     - The rightmost extension is processed first, then removed
     - This continues until no more known extensions remain
     - Example: For `file.html.md.njk`:
       1. Process with Nunjucks (.njk)
       2. Process result with markdown-it (.md)
       3. Final result is an HTML file
   - After all extensions are processed, layouts are applied if specified in front matter

5. **Postprocessing (Optional)**
   - If `_config.js` provides a `postprocess()` function:
     - It runs on all processed files at once
     - Can perform site-wide modifications before output
     - Useful for minification or other transformations

6. **File Output**
   - Plain files are copied as-is to the output directory
   - Processed files are written with processor extensions removed
   - Original directory structure is preserved

This phase-based approach gives PicoSSG the ability to handle relationships between files (through the metadata collection) while maintaining the predictable 1:1 mapping from source to output files. The pre/post processing functions provide powerful extension points for site-wide transformations.