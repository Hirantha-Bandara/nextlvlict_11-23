package com.nextlvlict.nextlvlict.hibernate;

import java.io.Serializable;

public class BundleRecordingId implements Serializable {

    private int bundleId;
    private int recordingId;

    public BundleRecordingId() {
    }

    public BundleRecordingId(int bundleId, int recordingId) {
        this.bundleId = bundleId;
        this.recordingId = recordingId;
    }

    public int getBundleId() {
        return bundleId;
    }

    public void setBundleId(int bundleId) {
        this.bundleId = bundleId;
    }

    public int getRecordingId() {
        return recordingId;
    }

    public void setRecordingId(int recordingId) {
        this.recordingId = recordingId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BundleRecordingId that = (BundleRecordingId) o;
        return bundleId == that.bundleId && recordingId == that.recordingId;
    }

    @Override
    public int hashCode() {
        return 31 * bundleId + recordingId;
    }
}
