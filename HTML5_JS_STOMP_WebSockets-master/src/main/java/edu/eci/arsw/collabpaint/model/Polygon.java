package edu.eci.arsw.collabpaint.model;

import java.util.ArrayList;

public class Polygon {
	private  String id;
	private  ArrayList<Integer> points = new ArrayList<Integer>();
	
	public Polygon(String id) {
		this.id = id;
	}

	
	public void addPoint(Point p) {
		points.add(p.getX());
		points.add(p.getY());		
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public ArrayList<Integer> getPoints() {
		return points;
	}

	public void setPoints(ArrayList<Integer> points) {
		this.points = points;
	}


	@Override
	public String toString() {
		return "Polygon [id=" + id + ", points=" + points + "]";
	}
	
	
	
}