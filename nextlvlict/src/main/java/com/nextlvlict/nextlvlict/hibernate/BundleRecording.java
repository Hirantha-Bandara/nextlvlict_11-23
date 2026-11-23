package com.nextlvlict.nextlvlict.hibernate;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "bundle_recordings")
public class BundleRecording implements Serializable {

    @Expose
    @EmbeddedId
    private BundleRecordingId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bundleId")
    @JoinColumn(name = "bundle_id")
    private RecordingBundle bundle;

    @Expose
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recordingId")
    @JoinColumn(name = "recording_id")
    private Recordings recording;

    public BundleRecording() {
    }

    public BundleRecordingId getId() {
        return id;
    }

    public void setId(BundleRecordingId id) {
        this.id = id;
    }

    public RecordingBundle getBundle() {
        return bundle;
    }

    public void setBundle(RecordingBundle bundle) {
        this.bundle = bundle;
    }

    public Recordings getRecording() {
        return recording;
    }

    public void setRecording(Recordings recording) {
        this.recording = recording;
    }
}
